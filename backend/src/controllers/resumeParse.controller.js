import { scheduleResumeParseById } from '../services/resume/parse.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message) {
  return res.status(status).json({ success: false, message, data: {} });
}

export async function parseResume(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Resume id is required');

    const resume = await scheduleResumeParseById(String(userId), id);
    if (!resume) return error(res, 404, 'Resume not found');

    return success(res, { resume }, 'Resume parsing initiated');
  } catch (err) {
    console.error('Parse resume error', err);
    return error(res, 500, 'Failed to parse resume');
  }
}
