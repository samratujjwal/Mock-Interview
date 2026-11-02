import mongoose from 'mongoose';
import { InterviewTemplate } from '../../models/index.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

export async function createInterviewTemplate(userId, data = {}) {
  const payload = {
    userId: userId || null,
    title: String(data.title || '').trim(),
    description: data.description || null,
    prompt: String(data.prompt || '').trim(),
    type: String(data.type || 'technical').trim(),
    difficulty: String(data.difficulty || 'medium').trim(),
    companyMode: String(data.companyMode || 'product').trim(),
    topic: String(data.topic || '').trim() || null,
    tags: Array.isArray(data.tags) ? data.tags.map(String).map((tag) => tag.trim()).filter(Boolean) : [],
    duplicateKey: String(data.duplicateKey || '').trim() || null,
    isFallback: data.isFallback !== false,
    status: String(data.status || 'active').trim(),
    metadata: data.metadata || {},
  };

  return InterviewTemplate.create(payload);
}

export async function listInterviewTemplates({ page = 1, limit = 20, filters = {} } = {}) {
  const safePage = Number.parseInt(page, 10) >= 1 ? Number.parseInt(page, 10) : 1;
  const safeLimit = Number.parseInt(limit, 10) >= 1 ? Number.parseInt(limit, 10) : 20;
  const skip = (safePage - 1) * safeLimit;

  const query = { isDeleted: false };

  if (filters.status) query.status = String(filters.status).trim();
  if (filters.type) query.type = String(filters.type).trim();
  if (filters.difficulty) query.difficulty = String(filters.difficulty).trim();
  if (filters.companyMode) query.companyMode = String(filters.companyMode).trim();
  if (filters.topic) query.topic = String(filters.topic).trim();
  if (filters.isFallback !== undefined) query.isFallback = Boolean(filters.isFallback);
  if (filters.userId && isValidObjectId(filters.userId)) query.userId = filters.userId;
  if (filters.duplicateKey) query.duplicateKey = String(filters.duplicateKey).trim();

  if (filters.scope === 'mine' && filters.userId && isValidObjectId(filters.userId)) {
    query.userId = filters.userId;
  }

  if (filters.search) {
    const search = String(filters.search).trim();
    if (search.length > 0) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { prompt: { $regex: search, $options: 'i' } },
      ];
    }
  }

  const [templates, total] = await Promise.all([
    InterviewTemplate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean()
      .exec(),
    InterviewTemplate.countDocuments(query).exec(),
  ]);

  return {
    templates,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function getInterviewTemplateById(templateId) {
  if (!isValidObjectId(templateId)) return null;
  return InterviewTemplate.findById(templateId).lean().exec();
}

export async function updateInterviewTemplate(userId, templateId, updates = {}) {
  if (!isValidObjectId(templateId)) return null;
  const allowedUpdates = [
    'title',
    'description',
    'prompt',
    'type',
    'difficulty',
    'companyMode',
    'topic',
    'tags',
    'duplicateKey',
    'isFallback',
    'status',
    'metadata',
  ];
  const payload = {};
  for (const key of allowedUpdates) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      payload[key] = updates[key];
    }
  }

  const query = { _id: templateId };
  if (userId) query.userId = userId;

  return InterviewTemplate.findOneAndUpdate({ ...query }, { $set: payload }, { new: true }).lean().exec();
}

export async function deleteInterviewTemplate(userId, templateId) {
  if (!isValidObjectId(templateId)) return null;

  const query = { _id: templateId };
  if (userId) query.userId = userId;

  const template = await InterviewTemplate.findOne(query).exec();
  if (!template) return null;

  await template.softDelete(userId || null);
  return template.toObject();
}

export async function findFallbackInterviewTemplate(criteria = {}, excludeDuplicateKeys = []) {
  const query = {
    status: 'active',
    isFallback: true,
  };

  if (criteria.type) query.type = String(criteria.type).trim();
  if (criteria.difficulty) query.difficulty = String(criteria.difficulty).trim();
  if (criteria.companyMode) query.companyMode = String(criteria.companyMode).trim();
  if (criteria.topic) query.topic = String(criteria.topic).trim();

  if (Array.isArray(excludeDuplicateKeys) && excludeDuplicateKeys.length > 0) {
    query.duplicateKey = { $nin: excludeDuplicateKeys.filter((key) => typeof key === 'string' && key.trim().length > 0).map((key) => key.trim()) };
  }

  return InterviewTemplate.findOne(query).sort({ createdAt: -1 }).lean().exec();
}
