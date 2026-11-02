import mongoose from 'mongoose';
import { JobDescription, Resume } from '../../models/index.js';

const REQUIRED_WEIGHT = 0.7;
const PREFERRED_WEIGHT = 0.2;
const RESPONSIBILITY_WEIGHT = 0.1;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .map((item) => item.toLowerCase())
      .filter((item, index, array) => array.indexOf(item) === index);
  }
  return [String(value || '').trim().toLowerCase()].filter(Boolean);
}

function normalizeText(value) {
  if (!value) return '';
  return String(value).toLowerCase().trim();
}

function buildSkillMatch(sourceSkills, targetSkills) {
  const normalizedSource = normalizeList(sourceSkills);
  const normalizedTarget = normalizeList(targetSkills);
  const matched = [];
  const missing = [];

  for (const target of normalizedTarget) {
    const found = normalizedSource.some((skill) => skill === target || skill.includes(target) || target.includes(skill));
    if (found) {
      matched.push(target);
    } else {
      missing.push(target);
    }
  }

  return { matched, missing };
}

function buildResponsibilityMatch(resumeText, responsibilities) {
  const normalizedText = normalizeText(resumeText);
  const matches = [];
  const missing = [];

  for (const responsibility of normalizeList(responsibilities)) {
    const normalizedResponsibility = responsibility.replace(/[\W_]+/g, ' ').trim();
    const found = normalizedResponsibility.split(' ').filter(Boolean).every((word) => normalizedText.includes(word));
    if (found) {
      matches.push(responsibility);
    } else {
      missing.push(responsibility);
    }
  }

  return { matched: matches, missing };
}

function calculateMatchPercent(required, preferred, responsibilities) {
  const requiredTotal = required.matched.length + required.missing.length;
  const preferredTotal = preferred.matched.length + preferred.missing.length;
  const responsibilitiesTotal = responsibilities.matched.length + responsibilities.missing.length;

  const requiredScore = requiredTotal === 0 ? 1 : required.matched.length / requiredTotal;
  const preferredScore = preferredTotal === 0 ? 1 : preferred.matched.length / preferredTotal;
  const responsibilityScore = responsibilitiesTotal === 0 ? 1 : responsibilities.matched.length / responsibilitiesTotal;

  const score = Math.round(
    Math.min(1, requiredScore) * REQUIRED_WEIGHT * 100 +
      Math.min(1, preferredScore) * PREFERRED_WEIGHT * 100 +
      Math.min(1, responsibilityScore) * RESPONSIBILITY_WEIGHT * 100,
  );

  return Math.max(0, Math.min(100, score));
}

function buildRecommendations(matchResult) {
  const recommendations = [];

  if (matchResult.requiredSkills.missing.length > 0) {
    recommendations.push(
      `Add or emphasize these required skills on your resume: ${matchResult.requiredSkills.missing.join(', ')}.`,
    );
  }

  if (matchResult.preferredSkills.missing.length > 0) {
    recommendations.push(
      `If you have experience with these preferred skills, include them more clearly: ${matchResult.preferredSkills.missing.join(', ')}.`,
    );
  }

  if (matchResult.responsibilities.missing.length > 0) {
    recommendations.push(
      `Strengthen your resume by aligning your achievements with these responsibilities: ${matchResult.responsibilities.missing.join(', ')}.`,
    );
  }

  if (matchResult.requiredSkills.missing.length === 0 && matchResult.preferredSkills.missing.length === 0) {
    recommendations.push('Your resume appears well-aligned with this job description. Focus on concrete examples and metrics for the matched skills.');
  }

  return recommendations;
}

export async function getResumeJdMatch(userId, jdId, resumeId) {
  if (!isValidObjectId(jdId) || !isValidObjectId(resumeId)) return null;

  const [jd, resume] = await Promise.all([
    JobDescription.findOne({ _id: jdId, userId }).lean().exec(),
    Resume.findOne({ _id: resumeId, userId }).lean().exec(),
  ]);

  if (!jd || !resume) return null;

  const requiredSkills = normalizeList(jd.extractedRequiredSkills || []);
  const preferredSkills = normalizeList(jd.extractedPreferredSkills || []);
  const responsibilities = normalizeList(jd.responsibilities || []);
  const resumeSkills = normalizeList(resume.extractedSkills || []);
  const resumeText = normalizeText(resume.parsedText || '');

  const requiredMatch = buildSkillMatch(resumeSkills, requiredSkills);
  const preferredMatch = buildSkillMatch(resumeSkills, preferredSkills);
  const responsibilityMatch = buildResponsibilityMatch(resumeText, responsibilities);

  const matchPercent = calculateMatchPercent(requiredMatch, preferredMatch, responsibilityMatch);
  const recommendations = buildRecommendations({ requiredSkills: requiredMatch, preferredSkills: preferredMatch, responsibilities: responsibilityMatch });

  return {
    resumeId: resume._id?.toString(),
    jobDescriptionId: jd._id?.toString(),
    matchPercent,
    requiredSkills: requiredMatch,
    preferredSkills: preferredMatch,
    responsibilities: responsibilityMatch,
    recommendations,
    scoreDetails: {
      required: requiredMatch,
      preferred: preferredMatch,
      responsibilities: responsibilityMatch,
    },
    resumeSummary: resume.extractedSummary || null,
    jdSummary: jd.jdSummary || null,
  };
}
