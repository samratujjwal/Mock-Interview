import {
  getDashboardSummary,
  getWeeklyProgress,
  getMonthlyProgress,
  getDashboardTopics,
  getDashboardStatistics,
} from '../services/dashboard.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message) {
  return res.status(status).json({ success: false, message, data: {} });
}

export async function dashboardSummary(req, res) {
  try {
    const userId = req.user?._id;
    const summary = await getDashboardSummary(userId);
    return success(res, { summary }, 'Dashboard summary retrieved');
  } catch (err) {
    console.error('Dashboard summary error', err);
    return error(res, 500, 'Failed to retrieve dashboard summary');
  }
}

export async function dashboardWeekly(req, res) {
  try {
    const userId = req.user?._id;
    const result = await getWeeklyProgress(userId);
    return success(res, { weekly: result.weeklyHours, meta: result.meta }, 'Weekly progress retrieved');
  } catch (err) {
    console.error('Dashboard weekly error', err);
    return error(res, 500, 'Failed to retrieve weekly progress');
  }
}

export async function dashboardMonthly(req, res) {
  try {
    const userId = req.user?._id;
    const result = await getMonthlyProgress(userId);
    return success(res, { monthly: result.monthlyHours, meta: result.meta }, 'Monthly progress retrieved');
  } catch (err) {
    console.error('Dashboard monthly error', err);
    return error(res, 500, 'Failed to retrieve monthly progress');
  }
}

export async function dashboardTopics(req, res) {
  try {
    const userId = req.user?._id;
    const type = req.params.type?.toLowerCase();
    if (!['strong', 'weak'].includes(type)) {
      return error(res, 400, 'Topic type must be strong or weak');
    }
    const result = await getDashboardTopics(userId, type);
    return success(res, { topics: result.topics, type }, `Dashboard ${type} topics retrieved`);
  } catch (err) {
    console.error('Dashboard topics error', err);
    return error(res, 500, 'Failed to retrieve dashboard topics');
  }
}

export async function dashboardStatistics(req, res) {
  try {
    const userId = req.user?._id;
    const statistics = await getDashboardStatistics(userId);
    return success(res, { statistics }, 'Dashboard statistics retrieved');
  } catch (err) {
    console.error('Dashboard statistics error', err);
    return error(res, 500, 'Failed to retrieve dashboard statistics');
  }
}
