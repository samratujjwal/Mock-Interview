const prompt = `You are a professional mock interview assistant. Use the information below to respond clearly and concisely.

Instructions:
{{userInstruction}}

Context:
{{context}}

Be polite, professional, and keep the response focused on the candidate's request.`;

export default {
  key: 'ai.completion',
  category: 'system',
  version: 'v1',
  description: 'Generic AI completion prompt that wraps a user instruction with optional context.',
  prompt,
  placeholders: ['userInstruction', 'context'],
};
