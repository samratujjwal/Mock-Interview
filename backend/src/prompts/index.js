import aiCompletionV1 from "./templates/ai.completion.v1.js";
import resumeAnalysisV1 from "./templates/resume.analysis.v1.js";
import resumeExtractionV1 from "./templates/resume.extraction.v1.js";
import resumeWeaknessesV1 from "./templates/resume.weaknesses.v1.js";
import jobDescriptionAnalysisV1 from "./templates/jobDescription.analysis.v1.js";
import interviewQuestionsV1 from "./templates/interview.questions.v1.js";
import interviewAnswerEvaluationV1 from "./templates/interview.answer.evaluation.v1.js";
import interviewFollowupV1 from "./templates/interview.followup.v1.js";
import interviewHintV1 from "./templates/interview.hint.v1.js";
import codingQuestionsV1 from "./templates/coding.questions.v1.js";
import codingReviewV1 from "./templates/coding.review.v1.js";
import codingOptimizeV1 from "./templates/coding.optimize.v1.js";

const promptTemplates = [
  aiCompletionV1,
  resumeAnalysisV1,
  resumeExtractionV1,
  resumeWeaknessesV1,
  jobDescriptionAnalysisV1,
  interviewQuestionsV1,
  interviewAnswerEvaluationV1,
  interviewFollowupV1,
  interviewHintV1,
  codingQuestionsV1,
  codingReviewV1,
  codingOptimizeV1,
];

const registry = promptTemplates.reduce((map, template) => {
  const key = String(template.key || "").trim();
  const version = String(template.version || "").trim();

  if (!key || !version) return map;

  if (!map[key]) {
    map[key] = {};
  }

  map[key][version] = {
    ...template,
    key,
    version,
  };

  return map;
}, {});

const latestVersion = Object.fromEntries(
  Object.entries(registry).map(([key, versions]) => {
    const sortedVersions = Object.keys(versions).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );
    return [key, versions[sortedVersions[sortedVersions.length - 1]]];
  }),
);

export function getPromptKeys() {
  return Object.keys(registry);
}

export function getPromptVersions(key) {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey || !registry[normalizedKey]) {
    return [];
  }
  return Object.keys(registry[normalizedKey]).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
}

export function getPromptTemplate(key, version) {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey || !registry[normalizedKey]) {
    return null;
  }

  if (version) {
    const normalizedVersion = String(version).trim();
    return registry[normalizedKey][normalizedVersion] || null;
  }

  return latestVersion[normalizedKey] || null;
}

export function getPromptMetadata(key, version) {
  const template = getPromptTemplate(key, version);
  if (!template) return null;
  const { prompt, placeholders, ...metadata } = template;
  return metadata;
}

export function listAllPrompts() {
  return getPromptKeys().map((key) => ({
    key,
    versions: getPromptVersions(key),
    latest: getPromptTemplate(key),
  }));
}

export default {
  getPromptKeys,
  getPromptVersions,
  getPromptTemplate,
  getPromptMetadata,
  listAllPrompts,
};
