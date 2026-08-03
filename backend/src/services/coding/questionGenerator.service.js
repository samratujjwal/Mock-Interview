import crypto from 'crypto';
import { aiService } from '../ai/ai.service.js';
import { safeJsonParse } from '../ai/response.service.js';
import { promptService } from '../prompt.service.js';
import { CodingQuestion } from '../../models/CodingQuestion.js';

const ALLOWED_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const DEFAULT_COUNT = 3;

function normalizeDifficulty(value) {
  const normalized = String(value || 'medium').trim().toLowerCase();
  return ALLOWED_DIFFICULTIES.has(normalized) ? normalized : 'medium';
}

function normalizeTopic(value) {
  return value ? String(value).trim() : null;
}

function normalizeCompanyMode(value) {
  return String(value || 'product').trim().toLowerCase();
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeExamples(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        return {
          input: String(entry.input ?? entry.stdin ?? '').trim(),
          output: String(entry.output ?? entry.expectedOutput ?? '').trim(),
          explanation: String(entry.explanation ?? '').trim() || null,
        };
      })
      .filter(Boolean);
  }
  return [];
}

function normalizeTestCases(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        return {
          input: String(entry.input ?? entry.stdin ?? '').trim(),
          output: String(entry.output ?? entry.expectedOutput ?? '').trim(),
          explanation: String(entry.explanation ?? '').trim() || null,
        };
      })
      .filter(Boolean);
  }
  return [];
}

function normalizeStarterCode(value) {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [language, code]) => {
      if (typeof code === 'string' && code.trim()) {
        acc[language] = code;
      }
      return acc;
    }, {});
  }
  return {};
}

function normalizeQuestionPayload(question = {}, fallbackDifficulty = 'medium', topic = null) {
  const title = String(question.title || question.prompt || '').trim();
  const description = String(question.description || question.prompt || '').trim();
  if (!title || !description) {
    return null;
  }

  const difficulty = normalizeDifficulty(question.difficulty || fallbackDifficulty);
  const constraints = Array.isArray(question.constraints)
    ? question.constraints.map((entry) => String(entry || '').trim()).filter(Boolean)
    : question.constraints
      ? [String(question.constraints).trim()]
      : [];

  const examples = normalizeExamples(question.examples ?? question.exampleCases ?? []);
  const sampleTestCases = normalizeTestCases(question.sampleTestCases ?? question.sampleTests ?? examples);
  const hiddenTestCases = normalizeTestCases(question.hiddenTestCases ?? question.hiddenTests ?? []);
  const supportedLanguages = normalizeArray(question.supportedLanguages ?? question.languages ?? 'javascript');
  const topicTags = normalizeArray(question.topicTags ?? question.topics ?? (topic ? [topic] : []));
  const companyTags = normalizeArray(question.companyTags ?? question.companyMode ?? []);
  const expectedComplexity = String(question.expectedComplexity || question.complexity || 'O(n)').trim();
  const metadata = question.metadata && typeof question.metadata === 'object'
    ? question.metadata
    : {};
  const normalizedMetadata = {
    ...metadata,
    source: metadata.source || 'ai-generated',
    category: metadata.category || topicTags[0] || 'general',
  };

  return {
    title,
    difficulty,
    description,
    constraints,
    examples,
    starterCode: normalizeStarterCode(question.starterCode ?? question.starter_code ?? {}),
    sampleTestCases,
    hiddenTestCases,
    supportedLanguages: supportedLanguages.length > 0 ? supportedLanguages : ['javascript'],
    companyTags: companyTags.length > 0 ? companyTags : [],
    topicTags,
    expectedComplexity,
    metadata: normalizedMetadata,
  };
}

function buildPromptContext({ role, difficulty, companyMode, topic, resumeSummary, jobDescriptionSummary, count }) {
  return {
    role: role || 'Software Engineer',
    difficulty: normalizeDifficulty(difficulty),
    companyMode: normalizeCompanyMode(companyMode),
    topic: normalizeTopic(topic) || 'General programming',
    resumeSummary: resumeSummary ? String(resumeSummary).trim() : 'No resume details provided.',
    jobDescriptionSummary: jobDescriptionSummary ? String(jobDescriptionSummary).trim() : 'No job description details provided.',
    count: Number.isInteger(count) && count > 0 ? count : DEFAULT_COUNT,
  };
}

function extractQuestionsFromAiResponse(rawResponse) {
  if (!rawResponse || typeof rawResponse !== 'object') {
    return [];
  }

  const parsed = safeJsonParse(rawResponse.text || rawResponse.content || rawResponse);
  if (parsed.error || !parsed.data) {
    return [];
  }

  const candidates = Array.isArray(parsed.data)
    ? parsed.data
    : Array.isArray(parsed.data.questions)
      ? parsed.data.questions
      : [];

  return candidates
    .map((question) => normalizeQuestionPayload(question, 'medium'))
    .filter(Boolean);
}

function createCuratedLibraryQuestions({ difficulty, topic }) {
  const normalizedTopic = normalizeTopic(topic);
  const entries = [
    {
      title: 'Two Sum',
      difficulty: 'easy',
      description: 'Given an array of integers and a target value, return the indices of two numbers that add up to the target.',
      constraints: ['1 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
      starterCode: {
        javascript: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i += 1) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) return [seen.get(complement), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n`,
        python: 'def twoSum(nums, target):\n    seen = {}\n    for i, value in enumerate(nums):\n        complement = target - value\n        if complement in seen:\n            return [seen[complement], i]\n        seen[value] = i\n    return []\n',
      },
      sampleTestCases: [{ input: 'nums = [2,7,11,15]\ntarget = 9', output: '[0,1]' }],
      hiddenTestCases: [{ input: 'nums = [3,2,4]\ntarget = 6', output: '[1,2]' }],
      supportedLanguages: ['javascript', 'python'],
      companyTags: ['product', 'faang'],
      topicTags: ['arrays', 'hashing'],
      expectedComplexity: 'O(n)',
      metadata: { source: 'curated-library', category: 'arrays-and-hashing' },
    },
    {
      title: 'Valid Parentheses',
      difficulty: 'medium',
      description: 'Determine if an input string containing parentheses is valid with properly matched pairs.',
      constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
      examples: [{ input: 's = "()[]{}"', output: 'true' }],
      starterCode: {
        javascript: `function isValid(s) {\n  const stack = [];\n  const map = {')': '(', '}': '{', ']': '['};\n  for (const ch of s) {\n    if ('({['.includes(ch)) stack.push(ch);\n    else if (stack.pop() !== map[ch]) return false;\n  }\n  return stack.length === 0;\n}\n`,
        python: 'def isValid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for ch in s:\n        if ch in "({[":\n            stack.append(ch)\n        elif not stack or stack.pop() != mapping[ch]:\n            return False\n    return not stack\n',
      },
      sampleTestCases: [{ input: 's = "()[]{}"', output: 'true' }],
      hiddenTestCases: [{ input: 's = "([)]"', output: 'false' }],
      supportedLanguages: ['javascript', 'python'],
      companyTags: ['product', 'startup'],
      topicTags: ['stack', 'strings'],
      expectedComplexity: 'O(n)',
      metadata: { source: 'curated-library', category: 'stack' },
    },
    {
      title: 'Merge Intervals',
      difficulty: 'medium',
      description: 'Merge overlapping intervals into a non-overlapping list sorted by start value.',
      constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length = 2'],
      examples: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }],
      starterCode: {
        javascript: `function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [];\n  for (const [start, end] of intervals) {\n    const last = merged[merged.length - 1];\n    if (!last || start > last[1]) merged.push([start, end]);\n    else last[1] = Math.max(last[1], end);\n  }\n  return merged;\n}\n`,
        python: 'def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for start, end in intervals:\n        if not merged or start > merged[-1][1]:\n            merged.append([start, end])\n        else:\n            merged[-1][1] = max(merged[-1][1], end)\n    return merged\n',
      },
      sampleTestCases: [{ input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }],
      hiddenTestCases: [{ input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' }],
      supportedLanguages: ['javascript', 'python'],
      companyTags: ['product', 'faang'],
      topicTags: ['array', 'sorting'],
      expectedComplexity: 'O(n log n)',
      metadata: { source: 'curated-library', category: 'sorting' },
    },
    {
      title: 'Binary Search',
      difficulty: 'easy',
      description: 'Find the index of a target value in a sorted array using binary search.',
      constraints: ['nums is sorted in ascending order', '1 <= nums.length <= 10^5'],
      examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
      starterCode: {
        javascript: `function search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n`,
        python: 'def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n',
      },
      sampleTestCases: [{ input: 'nums = [-1,0,3,5,9,12]\ntarget = 9', output: '4' }],
      hiddenTestCases: [{ input: 'nums = [-1,0,3,5,9,12]\ntarget = 2', output: '-1' }],
      supportedLanguages: ['javascript', 'python'],
      companyTags: ['product', 'startup'],
      topicTags: ['binary-search', 'array'],
      expectedComplexity: 'O(log n)',
      metadata: { source: 'curated-library', category: 'binary-search' },
    },
  ];

  const exactDifficultyEntries = entries.filter((entry) => entry.difficulty === difficulty);
  const mediumEntries = entries.filter((entry) => entry.difficulty === 'medium');
  const fallbackEntries = exactDifficultyEntries.length > 0 ? exactDifficultyEntries : mediumEntries;

  if (!normalizedTopic) {
    return fallbackEntries;
  }

  const byTopic = entries.filter((entry) => entry.topicTags.some((tag) => tag.toLowerCase() === normalizedTopic.toLowerCase()));
  if (byTopic.length > 0) {
    const topicSpecificDifficultyEntries = byTopic.filter((entry) => entry.difficulty === difficulty);
    return topicSpecificDifficultyEntries.length > 0 ? topicSpecificDifficultyEntries : byTopic;
  }

  return fallbackEntries;
}

function dedupeQuestions(questions = []) {
  const seen = new Set();
  return questions.filter((question) => {
    const key = String(question.title || question.prompt || '').trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function generateCodingQuestions(options = {}) {
  const {
    role = 'Software Engineer',
    difficulty = 'medium',
    companyMode = 'product',
    topic = null,
    resumeSummary = '',
    jobDescriptionSummary = '',
    count = DEFAULT_COUNT,
    useAi = true,
    persist = true,
  } = options;

  const normalizedDifficulty = normalizeDifficulty(difficulty);
  const requestCount = Math.max(1, Math.min(Number(count) || DEFAULT_COUNT, 5));
  const promptContext = buildPromptContext({
    role,
    difficulty: normalizedDifficulty,
    companyMode,
    topic,
    resumeSummary,
    jobDescriptionSummary,
    count: requestCount,
  });

  const curatedCandidates = createCuratedLibraryQuestions({
    difficulty: normalizedDifficulty,
    topic,
  }).slice(0, requestCount);

  if (!useAi) {
    const persisted = persist ? await Promise.all(curatedCandidates.map((candidate) => CodingQuestion.create({
      ...candidate,
      companyTags: Array.isArray(candidate.companyTags) ? candidate.companyTags : [],
      topicTags: Array.isArray(candidate.topicTags) ? candidate.topicTags : [],
      supportedLanguages: Array.isArray(candidate.supportedLanguages) ? candidate.supportedLanguages : ['javascript'],
      starterCode: candidate.starterCode || {},
      sampleTestCases: candidate.sampleTestCases || [],
      hiddenTestCases: candidate.hiddenTestCases || [],
      examples: candidate.examples || [],
      constraints: Array.isArray(candidate.constraints) ? candidate.constraints : [],
      metadata: candidate.metadata || {},
    }))) : [];
    return persist ? persisted.map((doc) => doc.toObject()) : curatedCandidates;
  }

  try {
    const prompt = promptService.renderPrompt({
      key: 'coding.questions',
      version: 'v1',
      values: promptContext,
    });

    const aiResult = await aiService.request({
      prompt,
      temperature: 0.8,
      maxTokens: 900,
      metadata: {
        route: 'coding.questions',
        difficulty: normalizedDifficulty,
        companyMode: normalizeCompanyMode(companyMode),
        topic: normalizeTopic(topic),
      },
    });

    const aiQuestions = extractQuestionsFromAiResponse(aiResult)
      .map((question) => normalizeQuestionPayload(question, normalizedDifficulty, normalizeTopic(topic)))
      .filter(Boolean);

    const combinedQuestions = dedupeQuestions([
      ...aiQuestions,
      ...curatedCandidates,
    ]).slice(0, requestCount);

    if (combinedQuestions.length > 0) {
      const persisted = persist ? await Promise.all(combinedQuestions.map((candidate) => CodingQuestion.create({
        title: candidate.title,
        difficulty: candidate.difficulty,
        description: candidate.description,
        constraints: candidate.constraints,
        examples: candidate.examples,
        starterCode: candidate.starterCode || {},
        sampleTestCases: candidate.sampleTestCases || [],
        hiddenTestCases: candidate.hiddenTestCases || [],
        supportedLanguages: candidate.supportedLanguages || ['javascript'],
        companyTags: candidate.companyTags || [],
        topicTags: candidate.topicTags || [],
        expectedComplexity: candidate.expectedComplexity || 'O(n)',
        metadata: candidate.metadata || {},
      }))) : [];

      return persist ? persisted.map((doc) => doc.toObject()) : combinedQuestions;
    }
  } catch (err) {
    console.warn('Coding question AI generation failed, falling back to curated library', err);
  }

  const persisted = persist ? await Promise.all(curatedCandidates.map((candidate) => CodingQuestion.create({
    title: candidate.title,
    difficulty: candidate.difficulty,
    description: candidate.description,
    constraints: candidate.constraints,
    examples: candidate.examples,
    starterCode: candidate.starterCode || {},
    sampleTestCases: candidate.sampleTestCases || [],
    hiddenTestCases: candidate.hiddenTestCases || [],
    supportedLanguages: candidate.supportedLanguages || ['javascript'],
    companyTags: candidate.companyTags || [],
    topicTags: candidate.topicTags || [],
    expectedComplexity: candidate.expectedComplexity || 'O(n)',
    metadata: candidate.metadata || {},
  }))) : [];

  return persist ? persisted.map((doc) => doc.toObject()) : curatedCandidates;
}
