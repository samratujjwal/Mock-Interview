const prompt = `You are a resume extraction assistant. Analyze the following candidate resume text and return a single JSON object with the following keys:

- skills: an array of distinct skills, tools, programming languages, and technologies.
- projects: an array of objects with {name, description, technologies}. If project names are unavailable, use a short descriptive title.
- experience: an object with {summary, totalYears, roles} where roles is an array of objects with {title, company, duration, summary}.
- education: an array of objects with {institution, degree, field, years}.
- certifications: an array of certification names.
- summary: a concise professional summary of the resume.

Resume Text:
{{resumeText}}

Return only valid JSON. Do not include any extra explanation or text outside the JSON object.`;

export default {
  key: 'resume.extraction',
  category: 'resume',
  version: 'v1',
  description: 'Extract structured skills, projects, experience, education, and certifications from parsed resume text.',
  prompt,
  placeholders: ['resumeText'],
};
