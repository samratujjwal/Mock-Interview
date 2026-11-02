const COMPANY_MODE_CATALOG = {
  product: {
    slug: 'product',
    label: 'Product',
    description: 'Balanced product-focused interview tone.',
    tone: 'Reasoned and execution-oriented with an emphasis on user impact, trade-offs, and roadmap thinking.',
    followUpDepth: 'moderate',
    styleGuidance: 'Ask balanced product questions that test prioritization, customer empathy, and decision quality.',
  },
  startup: {
    slug: 'startup',
    label: 'Startup',
    description: 'Fast-moving, ambiguity-tolerant interview tone.',
    tone: 'Action-first, scrappy, and resource-aware, with attention to shipping under uncertainty.',
    followUpDepth: 'deeper',
    styleGuidance: 'Probe for ownership, speed, trade-offs, and how the candidate handles moving without perfect information.',
  },
  faang: {
    slug: 'faang',
    label: 'FAANG',
    description: 'Structured, depth-driven, system-level interview tone.',
    tone: 'Precise, rigorous, and layered to emphasize scalability, abstraction, and long-term technical judgment.',
    followUpDepth: 'deep',
    styleGuidance: 'Push for scalable design, operational rigor, performance constraints, and decision clarity.',
  },
  'scale-up': {
    slug: 'scale-up',
    label: 'Scale-up',
    description: 'Cross-functional, reliability-heavy interview tone.',
    tone: 'Measured and structured, with emphasis on balancing growth, reliability, and collaboration.',
    followUpDepth: 'moderate',
    styleGuidance: 'Favor questions on resilience, process maturity, stakeholder alignment, and rollout planning.',
  },
};

const INTERVIEWER_PERSONALITY_CATALOG = {
  friendly: {
    slug: 'friendly',
    label: 'Friendly',
    description: 'Warm, encouraging, and conversational.',
    tone: 'Keep the candidate comfortable, ask supportive follow-ups, and make the interview feel collaborative.',
    followUpDepth: 'gentle',
  },
  professional: {
    slug: 'professional',
    label: 'Professional',
    description: 'Calm, precise, and business-ready.',
    tone: 'Maintain a steady and polished interview cadence with structured, high-signal questions.',
    followUpDepth: 'moderate',
  },
  strict: {
    slug: 'strict',
    label: 'Strict',
    description: 'Direct, challenging, and high-pressure.',
    tone: 'Push on assumptions, demand clarity, and increase the pace of follow-up questions.',
    followUpDepth: 'deep',
  },
  startup: {
    slug: 'startup',
    label: 'Startup',
    description: 'Fast-moving and execution-heavy personality style.',
    tone: 'Move quickly, challenge priorities, and emphasize ownership and bias for action.',
    followUpDepth: 'deep',
  },
  faang: {
    slug: 'faang',
    label: 'FAANG',
    description: 'Rigorous, structured, and detail-focused personality style.',
    tone: 'Ask layered follow-ups that reveal depth, system thinking, and decision quality.',
    followUpDepth: 'deep',
  },
  hr: {
    slug: 'hr',
    label: 'HR Specialist',
    description: 'Structured and people-centered interview personality style.',
    tone: 'Focus on motivation, communication clarity, collaboration, and team fit.',
    followUpDepth: 'moderate',
  },
  behavioral: {
    slug: 'behavioral',
    label: 'Behavioral Coach',
    description: 'Observational and evidence-driven personality style.',
    tone: 'Use STAR-oriented follow-up probes and focus on outcomes, learnings, and ownership.',
    followUpDepth: 'moderate',
  },
};

function normalizeSlug(value, fallback = 'product') {
  const normalized = String(value || fallback).trim().toLowerCase();
  return normalized.replace(/\s+/g, '-');
}

export function listCompanyModes() {
  return Object.values(COMPANY_MODE_CATALOG).map((mode) => ({
    ...mode,
    styleGuidance: String(mode.styleGuidance || '').trim(),
  }));
}

export function getCompanyModeProfile(companyMode) {
  const normalizedKey = normalizeSlug(companyMode, 'product');
  return COMPANY_MODE_CATALOG[normalizedKey] || COMPANY_MODE_CATALOG.product;
}

export function listInterviewerPersonalities() {
  return Object.values(INTERVIEWER_PERSONALITY_CATALOG).map((personality) => ({
    ...personality,
    tone: String(personality.tone || '').trim(),
  }));
}

export function getInterviewerPersonalityProfile(personality) {
  const normalizedKey = normalizeSlug(personality, 'professional');
  return INTERVIEWER_PERSONALITY_CATALOG[normalizedKey] || INTERVIEWER_PERSONALITY_CATALOG.professional;
}

export function getInterviewStyleContext({ companyMode = 'product', personality = 'professional' } = {}) {
  const companyProfile = getCompanyModeProfile(companyMode);
  const personalityProfile = getInterviewerPersonalityProfile(personality);

  return {
    companyMode: companyProfile.slug,
    companyLabel: companyProfile.label,
    companyDescription: companyProfile.description,
    companyTone: companyProfile.tone,
    personality: personalityProfile.slug,
    personalityLabel: personalityProfile.label,
    personalityDescription: personalityProfile.description,
    personalityTone: personalityProfile.tone,
    followUpDepth: personalityProfile.followUpDepth,
  };
}
