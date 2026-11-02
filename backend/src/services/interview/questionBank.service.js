import { InterviewTemplate } from '../../models/index.js';

export async function listQuestionBankCandidates(criteria = {}, existingDuplicateKeys = []) {
  const query = {
    status: 'active',
  };

  if (criteria.type) query.type = String(criteria.type).trim();
  if (criteria.difficulty) query.difficulty = String(criteria.difficulty).trim();
  if (criteria.companyMode) query.companyMode = String(criteria.companyMode).trim();
  if (criteria.topic) query.topic = String(criteria.topic).trim();

  if (Array.isArray(existingDuplicateKeys) && existingDuplicateKeys.length > 0) {
    query.duplicateKey = {
      $nin: existingDuplicateKeys
        .map((key) => String(key || '').trim())
        .filter(Boolean),
    };
  }

  return InterviewTemplate.find(query).sort({ createdAt: -1 }).lean().exec();
}
