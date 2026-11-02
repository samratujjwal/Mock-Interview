import mongoose from 'mongoose';
import { Resume } from '../../models/index.js';
import { promptService } from '../prompt.service.js';
import { aiService } from '../ai/ai.service.js';
import { formatAIResponse } from '../ai/response.service.js';

const WEAKNESS_TYPES = [
  'missing_github',
  'weak_project_descriptions',
  'missing_metrics',
  'missing_certifications',
  'unclear_experience',
  'weak_summary',
  'other',
];

const githubRegex = /github\.com|gitlab\.com|bitbucket\.org|codepen\.io|dev\.to/i;
const metricsRegex = /\b\d+(?:\.\d+)?%?|\b(?:increase|decrease|improve|improved|reduced|built|launched|delivered|achieved|managed|led|grew|saved)\b/i;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

function normalizeWeaknessItem(item) {
  if (!item || typeof item !== 'object') return null;
  const type = String(item.type || 'other').trim();
  const detail = String(item.detail || item.message || '').trim();
  const recommendation = String(item.recommendation || item.fix || item.suggestion || '').trim();
  if (!detail && !recommendation) return null;
  return {
    type: WEAKNESS_TYPES.includes(type) ? type : 'other',
    detail,
    recommendation,
  };
}

function normalizeWeaknessPayload(payload) {
  if (!payload || typeof payload !== 'object') return [];
  const list = Array.isArray(payload.weaknesses) ? payload.weaknesses : [];
  return list.map(normalizeWeaknessItem).filter(Boolean);
}

function buildResumeAnalysisPromptValues(resume) {
  return {
    resumeText: resume.parsedText || '',
    skills: resume.extractedSkills || [],
    projects: resume.extractedProjects || [],
    experience: resume.extractedExperience || {},
    education: resume.extractedEducation || [],
    certifications: resume.extractedCertifications || [],
  };
}

function extractHeuristicWeaknesses(resume) {
  const weaknesses = [];
  const text = String(resume.parsedText || '').trim();
  const skills = resume.extractedSkills || [];
  const projects = resume.extractedProjects || [];
  const experience = resume.extractedExperience || {};
  const certifications = resume.extractedCertifications || [];

  if (!githubRegex.test(text)) {
    weaknesses.push({
      type: 'missing_github',
      detail: 'No GitHub or public code portfolio link was detected in the resume text.',
      recommendation: 'Add a GitHub link or public portfolio to demonstrate code samples and open-source contributions.',
    });
  }

  if (projects.length === 0) {
    weaknesses.push({
      type: 'weak_project_descriptions',
      detail: 'No projects were captured in the resume extraction.',
      recommendation: 'Add at least one project with a clear description, technologies used, and results achieved.',
    });
  } else {
    const weakProject = projects.some((project) => {
      const description = String(project.description || '').trim();
      const technologies = Array.isArray(project.technologies) ? project.technologies : [];
      return description.length < 50 || technologies.length === 0;
    });
    if (weakProject) {
      weaknesses.push({
        type: 'weak_project_descriptions',
        detail: 'Some project entries lack sufficient detail or technology context.',
        recommendation: 'Improve project descriptions with measurable outcomes, technologies used, and your personal contribution.',
      });
    }
  }

  const experienceSummary = String(experience.summary || '').trim();
  const experienceHasMetrics = metricsRegex.test(text) || metricsRegex.test(experienceSummary) || (experience.roles || []).some((role) => metricsRegex.test(String(role.summary || '')));
  if (!experienceHasMetrics) {
    weaknesses.push({
      type: 'missing_metrics',
      detail: 'The resume does not appear to include measurable metrics or achievement statements.',
      recommendation: 'Include metrics such as percentages, numbers, or business impact for each role whenever possible.',
    });
  }

  if (certifications.length === 0) {
    weaknesses.push({
      type: 'missing_certifications',
      detail: 'No certifications were identified in the extracted resume data.',
      recommendation: 'Add relevant certifications or training to support your technical credibility.',
    });
  }

  if (!experienceSummary && (experience.roles || []).length === 0) {
    weaknesses.push({
      type: 'unclear_experience',
      detail: 'Experience details are not clearly defined in the resume.',
      recommendation: 'Clarify your professional experience by listing roles, companies, and outcomes for each position.',
    });
  }

  if (String(resume.extractedSummary || '').trim().length < 40) {
    weaknesses.push({
      type: 'weak_summary',
      detail: 'The resume summary is short or missing.',
      recommendation: 'Add a stronger professional summary that highlights your core skills and accomplishments.',
    });
  }

  return weaknesses;
}

async function doWeaknessAnalysis(resume) {
  const values = buildResumeAnalysisPromptValues(resume);
  const prompt = promptService.renderPrompt({
    key: 'resume.weaknesses',
    version: 'v1',
    values,
  });

  const aiResult = await aiService.request({
    prompt,
    model: process.env.AI_RESUME_WEAKNESS_MODEL || undefined,
    temperature: 0.2,
    maxTokens: 700,
    metadata: { route: 'resume.weaknesses', resumeId: resume._id?.toString() },
  });

  const formatted = formatAIResponse(aiResult);
  const weaknesses = normalizeWeaknessPayload(formatted.parsedJson);
  let error = formatted.jsonParseError;
  let status = 'failed';

  if (weaknesses.length > 0) {
    status = 'completed';
  } else {
    const fallbackWeaknesses = extractHeuristicWeaknesses(resume);
    if (fallbackWeaknesses.length > 0) {
      status = 'completed';
      error = `AI JSON parse failed: ${formatted.jsonParseError}. Fallback heuristics applied.`;
      return { weaknesses: fallbackWeaknesses, error, status };
    }
  }

  return { weaknesses, error, status };
}

export async function analyzeResumeWeaknessesById(userId, resumeId) {
  if (!isValidObjectId(resumeId)) return null;
  const resume = await Resume.findOne({ _id: resumeId, userId }).exec();
  if (!resume) return null;

  if (!resume.parsedText) {
    resume.weaknessStatus = 'failed';
    resume.weaknessError = 'Resume text has not been parsed yet';
    resume.weaknessesAt = new Date();
    await resume.save();
    return resume.toObject();
  }

  resume.weaknessStatus = 'pending';
  resume.weaknessError = null;
  resume.weaknessesAt = new Date();
  await resume.save();

  try {
    const result = await doWeaknessAnalysis(resume);
    resume.weaknesses = result.weaknesses || [];
    resume.weaknessStatus = result.status;
    resume.weaknessError = result.error || null;
    resume.weaknessesAt = new Date();
    await resume.save();
    return resume.toObject();
  } catch (err) {
    const errorMessage = String(err.message || 'Weakness analysis failed');
    resume.weaknessStatus = 'failed';
    resume.weaknessError = errorMessage;
    resume.weaknessesAt = new Date();
    await resume.save();
    return resume.toObject();
  }
}

export async function getResumeWeaknessesById(userId, resumeId) {
  if (!isValidObjectId(resumeId)) return null;
  return Resume.findOne({ _id: resumeId, userId })
    .select('weaknesses weaknessStatus weaknessError weaknessesAt')
    .lean()
    .exec();
}
