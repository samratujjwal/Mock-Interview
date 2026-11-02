const prompt = `You are an expert resume reviewer. Analyze the candidate resume text and previously extracted resume structure and identify weaknesses and opportunities for improvement.

Provide a JSON response with the following shape:
{
  "weaknesses": [
    {
      "type": "missing_github|weak_project_descriptions|missing_metrics|missing_certifications|unclear_experience|weak_summary|other",
      "detail": "Short explanation of the issue",
      "recommendation": "Specific recommendation to improve this resume area"
    }
  ]
}

Resume text:
{{resumeText}}

Extracted data:
Skills: {{skills}}
Projects: {{projects}}
Experience: {{experience}}
Education: {{education}}
Certifications: {{certifications}}

Focus on the following weaknesses when present:
- Missing GitHub or public code portfolio links for technical roles.
- Weak or vague project descriptions without measurable outcomes or technology details.
- Lack of metrics, achievements, or quantified results in experience bullet points.
- Missing certifications or evidence of continuous learning when relevant.
- Unclear role summaries or overly generic experience descriptions.

Return only valid JSON. Do not include any commentary outside the JSON object.`;

export default {
  key: 'resume.weaknesses',
  category: 'resume',
  version: 'v1',
  description: 'Detect resume weaknesses related to GitHub links, project descriptions, metrics, certifications, and overall clarity.',
  prompt,
  placeholders: ['resumeText', 'skills', 'projects', 'experience', 'education', 'certifications'],
};
