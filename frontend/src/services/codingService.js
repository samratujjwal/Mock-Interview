import api from './api';

const buildQuestionPayload = ({ difficulty = 'medium', companyMode = 'product', topic = 'arrays', count = 1, useAi = true, persist = false } = {}) => ({
  difficulty,
  companyMode,
  topic,
  count,
  useAi,
  persist,
});

export const fetchCodingQuestion = async (options = {}) => {
  const response = await api.post('/ai/questions/coding', buildQuestionPayload(options));
  const questions = response.data?.data?.questions || [];
  return questions[0] || null;
};

export const runCode = async ({ questionId, sourceCode, language, stdin = '' }) => {
  const response = await api.post('/coding/run', {
    questionId,
    sourceCode,
    language,
    stdin,
  });

  return response.data?.data || null;
};

export const submitCode = async ({ questionId, sourceCode, language }) => {
  const response = await api.post('/coding/submit', {
    questionId,
    sourceCode,
    language,
  });

  return response.data?.data || null;
};

export const reviewCode = async ({ sourceCode, language, questionDescription }) => {
  const response = await api.post('/coding/review', {
    sourceCode,
    language,
    questionDescription,
  });

  return response.data?.data || null;
};

export const optimizeCode = async ({ sourceCode, language, questionDescription }) => {
  const response = await api.post('/coding/optimize', {
    sourceCode,
    language,
    questionDescription,
  });

  return response.data?.data || null;
};
