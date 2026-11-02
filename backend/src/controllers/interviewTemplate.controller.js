import {
  createInterviewTemplate,
  listInterviewTemplates,
  getInterviewTemplateById,
  updateInterviewTemplate,
  deleteInterviewTemplate,
  findFallbackInterviewTemplate,
} from '../services/interview/template.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message) {
  return res.status(status).json({ success: false, message, data: {} });
}

export async function createTemplate(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { title, description, prompt, type, difficulty, companyMode, topic, tags, duplicateKey, isFallback, status, metadata } = req.body;
    if (!title || !String(title).trim()) return error(res, 422, 'Template title is required');
    if (!prompt || !String(prompt).trim()) return error(res, 422, 'Template prompt is required');

    const template = await createInterviewTemplate(String(userId), {
      title,
      description,
      prompt,
      type,
      difficulty,
      companyMode,
      topic,
      tags,
      duplicateKey,
      isFallback,
      status,
      metadata,
    });

    return success(res, { template }, 'Interview template created');
  } catch (err) {
    console.error('Create interview template error', err);
    return error(res, 500, 'Failed to create interview template');
  }
}

export async function listTemplates(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { page = 1, limit = 20, status, type, difficulty, companyMode, topic, search, isFallback, scope } = req.query;
    const result = await listInterviewTemplates({
      page,
      limit,
      filters: {
        scope,
        userId: String(userId),
        status,
        type,
        difficulty,
        companyMode,
        topic,
        search,
        isFallback,
      },
    });

    return success(res, { templates: result.templates, meta: result.meta }, 'Interview templates retrieved');
  } catch (err) {
    console.error('List interview templates error', err);
    return error(res, 500, 'Failed to retrieve interview templates');
  }
}

export async function getTemplate(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Template id is required');

    const template = await getInterviewTemplateById(id);
    if (!template) return error(res, 404, 'Interview template not found');

    return success(res, { template }, 'Interview template retrieved');
  } catch (err) {
    console.error('Get interview template error', err);
    return error(res, 500, 'Failed to retrieve interview template');
  }
}

export async function updateTemplate(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Template id is required');

    const template = await updateInterviewTemplate(String(userId), id, req.body || {});
    if (!template) return error(res, 404, 'Interview template not found');

    return success(res, { template }, 'Interview template updated');
  } catch (err) {
    console.error('Update interview template error', err);
    return error(res, 500, 'Failed to update interview template');
  }
}

export async function deleteTemplate(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Template id is required');

    const template = await deleteInterviewTemplate(String(userId), id);
    if (!template) return error(res, 404, 'Interview template not found');

    return success(res, { template }, 'Interview template deleted');
  } catch (err) {
    console.error('Delete interview template error', err);
    return error(res, 500, 'Failed to delete interview template');
  }
}

export async function getFallbackTemplate(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const criteria = {
      type: req.query.type,
      difficulty: req.query.difficulty,
      companyMode: req.query.companyMode,
      topic: req.query.topic,
    };
    const excludeDuplicateKeys = Array.isArray(req.query.excludeDuplicateKeys)
      ? req.query.excludeDuplicateKeys
      : typeof req.query.excludeDuplicateKeys === 'string'
        ? req.query.excludeDuplicateKeys.split(',')
        : [];

    const template = await findFallbackInterviewTemplate(criteria, excludeDuplicateKeys);
    if (!template) return error(res, 404, 'No fallback interview template found');

    return success(res, { template }, 'Fallback interview template retrieved');
  } catch (err) {
    console.error('Get fallback interview template error', err);
    return error(res, 500, 'Failed to retrieve fallback interview template');
  }
}
