import mongoose from 'mongoose';
import { Resume } from '../../models/index.js';
import { promptService } from '../prompt.service.js';
import { aiService } from '../ai/ai.service.js';
import { formatAIResponse } from '../ai/response.service.js';

const SKILLS_HEADINGS = [/skills?/i, /technical skills?/i, /expertise/i, /technologies/i];
const CERTIFICATIONS_HEADINGS = [/certifications?/i, /licenses?/i];
const EDUCATION_HEADINGS = [/education/i, /academic background/i, /degree/i];
const EXPERIENCE_HEADINGS = [/experience/i, /professional experience/i, /work experience/i];

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((item) => item != null && String(item).trim()).map((item) => String(item).trim());
  return [String(value).trim()];
}

function normalizeProject(project) {
  if (!project || typeof project !== 'object') return null;
  const name = String(project.name || project.title || project.id || '').trim();
  const description = String(project.description || project.summary || '').trim();
  const technologies = normalizeArray(project.technologies || project.tech || project.tools);
  if (!name && !description && technologies.length === 0) return null;
  return { name: name || 'Unnamed project', description, technologies };
}

function normalizeRole(role) {
  if (!role || typeof role !== 'object') return null;
  const title = String(role.title || role.position || '').trim();
  const company = String(role.company || role.employer || '').trim();
  const duration = String(role.duration || role.years || '').trim();
  const summary = String(role.summary || role.description || '').trim();
  if (!title && !company && !duration && !summary) return null;
  return { title, company, duration, summary };
}

function normalizeEducation(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const institution = String(entry.institution || entry.school || entry.university || '').trim();
  const degree = String(entry.degree || entry.qualification || '').trim();
  const field = String(entry.field || entry.major || '').trim();
  const years = String(entry.years || entry.duration || entry.period || '').trim();
  if (!institution && !degree && !field && !years) return null;
  return { institution, degree, field, years };
}

function normalizeExperience(experience) {
  if (!experience || typeof experience !== 'object') return { summary: '', totalYears: '', roles: [] };
  const summary = String(experience.summary || experience.overview || '').trim();
  const totalYears = String(experience.totalYears || experience.years || '').trim();
  const roles = normalizeArray(experience.roles).map(normalizeRole).filter(Boolean);
  return { summary, totalYears, roles };
}

function normalizeExtractionPayload(payload) {
  const skills = normalizeArray(payload.skills);
  const certifications = normalizeArray(payload.certifications);
  const summary = String(payload.summary || '').trim();
  const projects = normalizeArray(payload.projects).map((item) => {
    if (typeof item === 'string') {
      return { name: item.trim(), description: '', technologies: [] };
    }
    return normalizeProject(item);
  }).filter(Boolean);

  const education = normalizeArray(payload.education).map(normalizeEducation).filter(Boolean);
  const experience = normalizeExperience(payload.experience || {});

  return {
    skills,
    certifications,
    summary,
    projects,
    education,
    experience,
  };
}

function extractSectionLines(text, headings) {
  if (!text || !headings?.length) return [];
  const lower = text;
  for (const heading of headings) {
    const match = heading.exec(lower);
    if (!match) continue;
    const start = match.index + match[0].length;
    const snippet = text.slice(start);
    const lines = snippet.split(/\r?\n/).slice(0, 20);
    const collected = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) break;
      if (/^[A-Za-z ]{1,40}:$/.test(trimmed)) break;
      collected.push(trimmed);
    }
    if (collected.length) return collected;
  }
  return [];
}

function parseListFromSection(lines) {
  const values = [];
  for (const line of lines) {
    const candidates = line.split(/[•\-–,;]+/).map((part) => part.trim()).filter(Boolean);
    for (const candidate of candidates) {
      if (values.includes(candidate)) continue;
      values.push(candidate);
    }
  }
  return values;
}

function extractHeuristics(text) {
  const fallback = {
    skills: [],
    certifications: [],
    education: [],
    projects: [],
    experience: { summary: '', totalYears: '', roles: [] },
    summary: '',
  };

  const skillsSection = extractSectionLines(text, SKILLS_HEADINGS);
  fallback.skills = parseListFromSection(skillsSection);

  const certSection = extractSectionLines(text, CERTIFICATIONS_HEADINGS);
  fallback.certifications = parseListFromSection(certSection);

  const educationSection = extractSectionLines(text, EDUCATION_HEADINGS);
  fallback.education = [{ institution: educationSection.join(' ') }].filter((item) => item.institution);

  const experienceSection = extractSectionLines(text, EXPERIENCE_HEADINGS);
  fallback.experience.summary = experienceSection.join(' ');

  const preview = text.split(/\r?\n/).slice(0, 4).join(' ');
  fallback.summary = preview;

  return fallback;
}

async function doExtractResume(resume) {
  const prompt = promptService.renderPrompt({
    key: 'resume.extraction',
    version: 'v1',
    values: {
      resumeText: resume.parsedText,
    },
  });

  const aiResult = await aiService.request({
    prompt,
    model: process.env.AI_RESUME_MODEL || undefined,
    temperature: 0.2,
    maxTokens: 900,
    metadata: { route: 'resume.extraction', resumeId: resume._id?.toString() },
  });

  const formatted = formatAIResponse(aiResult);
  let extractedData = null;
  let extractionError = formatted.jsonParseError;
  let status = 'failed';

  if (formatted.parsedJson && typeof formatted.parsedJson === 'object') {
    extractedData = normalizeExtractionPayload(formatted.parsedJson);
    status = 'completed';
  } else {
    const heuristic = extractHeuristics(resume.parsedText);
    if (heuristic.skills.length || heuristic.certifications.length || heuristic.experience.summary || heuristic.education.length) {
      extractedData = heuristic;
      extractionError = `AI JSON parse failed: ${formatted.jsonParseError}. Fallback heuristics applied.`;
      status = 'completed';
    }
  }

  resume.extractionStatus = status;
  resume.extractionError = extractionError;
  resume.extractedAt = new Date();

  if (extractedData) {
    resume.extractedSkills = extractedData.skills;
    resume.extractedCertifications = extractedData.certifications;
    resume.extractedSummary = extractedData.summary;
    resume.extractedProjects = extractedData.projects;
    resume.extractedEducation = extractedData.education;
    resume.extractedExperience = extractedData.experience;
  }

  await resume.save();
}

export async function extractResumeById(userId, resumeId) {
  if (!isValidObjectId(resumeId)) return null;

  const resume = await Resume.findOne({ _id: resumeId, userId }).exec();
  if (!resume) return null;

  if (!resume.parsedText) {
    resume.extractionStatus = 'failed';
    resume.extractionError = 'Resume text has not been parsed yet';
    resume.extractedAt = new Date();
    await resume.save();
    return resume.toObject();
  }

  resume.extractionStatus = 'pending';
  resume.extractionError = null;
  resume.extractedAt = new Date();
  await resume.save();

  void doExtractResume(resume).catch((err) => {
    console.error('Background resume extraction failed', err);
  });

  return resume.toObject();
}
