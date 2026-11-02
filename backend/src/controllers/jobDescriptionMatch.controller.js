import { getResumeJdMatch } from '../services/jd/match.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message) {
  return res.status(status).json({ success: false, message, data: {} });
}

export async function matchResumeToJd(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    const { resumeId } = req.body;
    if (!id) return error(res, 422, 'Job description id is required');
    if (!resumeId) return error(res, 422, 'Resume id is required');

    const match = await getResumeJdMatch(String(userId), id, resumeId);
    if (!match) return error(res, 404, 'Resume or job description not found');

    return success(res, { match }, 'Job description matched against resume');
  } catch (err) {
    console.error('Match resume to JD error', err);
    return error(res, 500, 'Failed to match resume to job description');
  }
}
