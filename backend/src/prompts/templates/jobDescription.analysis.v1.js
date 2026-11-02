const prompt = `You are a hiring analyst. Read the job description below and extract the most important skills, experience levels, and priorities for the role.

Job Description:
{{jobDescriptionText}}

Respond with JSON containing:
- requiredSkills: array of the most important required skills
- preferredSkills: array of additional desirable skills
- keyResponsibilities: array of primary responsibilities
- idealExperience: short description of the ideal candidate experience
`;

export default {
  key: 'jobDescription.analysis',
  category: 'jobDescription',
  version: 'v1',
  description: 'Job description analysis prompt for extracting skills, responsibilities, and ideal candidate experience.',
  prompt,
  placeholders: ['jobDescriptionText'],
};
