import {
  analyzeResumeWeaknessesById,
  getResumeWeaknessesById,
} from '../services/resume/weakness.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message) {
  return res.status(status).json({ success: false, message, data: {} });
}

export async function analyzeResumeWeaknesses(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Resume id is required');

    const resume = await analyzeResumeWeaknessesById(String(userId), id);
    if (!resume) return error(res, 404, 'Resume not found');

    return success(res, { resume }, 'Resume weakness analysis initiated');
  } catch (err) {
    console.error('Analyze resume weaknesses error', err);
    return error(res, 500, 'Failed to analyze resume weaknesses');
  }
}

export async function getResumeWeaknesses(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Resume id is required');

    const weaknesses = await getResumeWeaknessesById(String(userId), id);
    if (!weaknesses) return error(res, 404, 'Resume not found');

    return success(res, { weaknesses }, 'Resume weaknesses retrieved');
  } catch (err) {
    console.error('Get resume weaknesses error', err);
    return error(res, 500, 'Failed to retrieve resume weaknesses');
  }
}
