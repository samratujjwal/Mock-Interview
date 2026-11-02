import { JobDescription } from '../../models/index.js';
import { promptService } from '../prompt.service.js';
import { aiService } from '../ai/ai.service.js';
import { formatAIResponse } from '../ai/response.service.js';
import pdfParse from 'pdf-parse';

const REQUIRED_HEADINGS = [/required skills?/i, /skills? required/i, /must have/i, /qualifications?/i, /requirements?/i];
const PREFERRED_HEADINGS = [/preferred skills?/i, /nice to have/i, /desired qualifications?/i, /preferred qualifications?/i];
const RESPONSIBILITIES_HEADINGS = [/responsibilities?/i, /you will/i, /what you will do/i, /key responsibilities?/i, /role includes/i];
const IDEAL_EXPERIENCE_HEADINGS = [/ideal candidate/i, /ideal experience/i, /experience required/i, /experience preferred/i];

function normalizeText(value) {
  if (!value) return '';
  return String(value).trim();
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter(Boolean)
      .filter((item, index, array) => array.indexOf(item) === index);
  }
  return [normalizeText(value)].filter(Boolean);
}

function normalizeExtractionPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      requiredSkills: [],
      preferredSkills: [],
      keyResponsibilities: [],
      idealExperience: '',
    };
  }

  return {
    requiredSkills: normalizeArray(payload.requiredSkills || payload.required_skill || payload.required_skillset || payload.requiredSkills),
    preferredSkills: normalizeArray(payload.preferredSkills || payload.preferred_skill || payload.preferred_skillset || payload.preferredSkills),
    keyResponsibilities: normalizeArray(payload.keyResponsibilities || payload.key_responsibilities || payload.responsibilities || payload.keyResponsibilities),
    idealExperience: normalizeText(payload.idealExperience || payload.ideal_experience || payload.idealCandidateExperience || payload.ideal_candidate_experience || payload.idealExperience),
  };
}

function extractSectionLines(text, headings) {
  if (!text || !Array.isArray(headings) || headings.length === 0) return [];
  const lower = text;
  for (const heading of headings) {
    const match = heading.exec(lower);
    if (!match) continue;
    const start = match.index + match[0].length;
    const snippet = text.slice(start);
    const lines = snippet.split(/\r?\n/);
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
      if (!values.includes(candidate)) {
        values.push(candidate);
      }
    }
  }
  return values;
}

function extractHeuristics(text) {
  const requiredSkills = parseListFromSection(extractSectionLines(text, REQUIRED_HEADINGS));
  const preferredSkills = parseListFromSection(extractSectionLines(text, PREFERRED_HEADINGS));
  const keyResponsibilities = parseListFromSection(extractSectionLines(text, RESPONSIBILITIES_HEADINGS));
  const idealExperienceLines = extractSectionLines(text, IDEAL_EXPERIENCE_HEADINGS);
  const idealExperience = idealExperienceLines.join(' ').trim();

  return {
    requiredSkills,
    preferredSkills,
    keyResponsibilities,
    idealExperience,
  };
}

export async function fetchJdBuffer(jd) {
  if (!jd || !jd.secureUrl) {
    throw new Error('JD secure URL missing');
  }

  const response = await fetch(jd.secureUrl);
  if (!response.ok) {
    throw new Error(`Failed to download JD content (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function extractTextFromJdBuffer(buffer, mimeType) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid JD buffer');
  }

  if (String(mimeType).toLowerCase() === 'text/plain') {
    return buffer.toString('utf8').trim();
  }

  const data = await pdfParse(buffer);
  return data?.text?.trim() || '';
}

async function doExtractJD(jd) {
  const text = normalizeText(jd.parsedText);
  if (!text) {
    throw new Error('No JD text available for extraction');
  }

  const prompt = promptService.renderPrompt({
    key: 'jobDescription.analysis',
    version: 'v1',
    values: { jobDescriptionText: text },
  });

  const aiResult = await aiService.request({
    prompt,
    model: process.env.AI_JD_ANALYSIS_MODEL || undefined,
    temperature: 0.25,
    maxTokens: 600,
    metadata: { route: 'jobDescription.analysis', jdId: jd._id?.toString() },
  });

  const formatted = formatAIResponse(aiResult);
  let extracted = null;
  let extractionError = formatted.jsonParseError;
  let status = 'failed';

  if (formatted.parsedJson && typeof formatted.parsedJson === 'object') {
    extracted = normalizeExtractionPayload(formatted.parsedJson);
    status = 'completed';
  } else {
    extracted = extractHeuristics(text);
    extractionError = `AI JSON parse failed: ${formatted.jsonParseError}. Fallback heuristics applied.`;
    status = 'completed';
  }

  jd.extractedRequiredSkills = extracted.requiredSkills;
  jd.extractedPreferredSkills = extracted.preferredSkills;
  jd.responsibilities = extracted.keyResponsibilities;
  jd.jdSummary = extracted.idealExperience;
  jd.extractionStatus = status;
  jd.extractionError = extractionError || null;
  jd.extractedAt = new Date();

  await jd.save();
}

async function doParseJD(jd) {
  if (!jd) throw new Error('JobDescription is required');

  let parsedText = '';
  let parseError = null;
  let status = 'failed';

  try {
    const buffer = await fetchJdBuffer(jd);
    parsedText = await extractTextFromJdBuffer(buffer, jd.mimeType);
    status = 'completed';
  } catch (err) {
    parseError = String(err.message || 'JD parse failed');
    console.warn('JD parse error', { jdId: jd._id?.toString(), error: parseError });
  }

  jd.parsedText = parsedText || null;
  jd.parseStatus = status;
  jd.parseError = parseError;
  jd.parsedAt = new Date();
  await jd.save();

  if (status === 'completed' && parsedText) {
    try {
      await doExtractJD(jd);
    } catch (err) {
      console.error('JD extraction failed', err);
      jd.extractionStatus = 'failed';
      jd.extractionError = String(err.message || 'JD extraction failed');
      jd.extractedAt = new Date();
      await jd.save();
    }
  }

  return jd.toObject();
}

export async function scheduleJDParseById(userId, jdId) {
  const jd = await JobDescription.findOne({ _id: jdId, userId }).exec();
  if (!jd) return null;

  const mimeType = String(jd.mimeType || '').toLowerCase();
  if (!['application/pdf', 'text/plain'].includes(mimeType)) {
    jd.parseStatus = 'failed';
    jd.parseError = 'Unsupported JD mime type for parsing';
    jd.parsedAt = new Date();
    await jd.save();
    return jd.toObject();
  }

  jd.parseStatus = 'pending';
  jd.parseError = null;
  jd.extractionStatus = 'pending';
  jd.extractionError = null;
  await jd.save();

  void doParseJD(jd).catch((err) => {
    console.error('Background JD parse failed', err);
  });

  return jd.toObject();
}
