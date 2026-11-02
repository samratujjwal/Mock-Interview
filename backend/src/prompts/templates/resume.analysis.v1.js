const prompt = `You are an expert resume analyst. Review the candidate's resume and return a structured summary with strengths, skill gaps, and interview question suggestions.

Resume Text:
{{resumeText}}

Respond with JSON containing:
- strengths: array of key strengths
- gaps: array of potential experience gaps
- recommendedTopics: array of interview topic suggestions
`;

export default {
  key: 'resume.analysis',
  category: 'resume',
  version: 'v1',
  description: 'Resume analysis prompt for extracting strengths, gaps, and suggested interview topics.',
  prompt,
  placeholders: ['resumeText'],
};
