const prompt = `You are a senior mock interview coach. Generate high-quality interview questions tailored to the candidate profile and the requested interview type.

Return ONLY valid JSON. Do not include markdown fences.

Rules:
- Return a JSON array of objects.
- Each object must have exactly these fields:
  - prompt: string
  - type: string
  - difficulty: string
  - topic: string or null
  - duplicateKey: string
  - metadata: object
- Use the provided interview context and interviewer personality to personalize the questions.
- Keep every question practical, realistic, and interview-ready.
- Avoid duplicate questions or overlapping concepts.
- Ensure the response can be parsed by a JSON parser immediately.

Interview context:
- Role: {{role}}
- Type: {{type}}
- Difficulty: {{difficulty}}
- Company mode: {{companyMode}}
- Interviewer personality: {{personality}}
- Topic: {{topic}}
- Resume summary: {{resumeSummary}}
- Job description summary: {{jobDescriptionSummary}}
- Previous questions: {{previousQuestions}}
- Desired question count: {{count}}

Output schema:
[
  {
    "prompt": "Question text",
    "type": "technical",
    "difficulty": "medium",
    "topic": "Node.js",
    "duplicateKey": "nodejs-async-patterns",
    "metadata": {
      "source": "ai-generated",
      "reason": "tailored to the role and company context"
    }
  }
]
`;

export default {
  key: 'interview.questions',
  category: 'interview',
  version: 'v1',
  description: 'Generate personalized interview questions for a mock interview session.',
  prompt,
  placeholders: ['role', 'type', 'difficulty', 'companyMode', 'personality', 'topic', 'resumeSummary', 'jobDescriptionSummary', 'previousQuestions', 'count'],
};
