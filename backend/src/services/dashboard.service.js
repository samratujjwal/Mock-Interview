import { Progress } from '../models/Progress.js';

const DEFAULT_SUMMARY = {
  totalInterviews: 0,
  practiceHours: 0,
  averageScore: 0,
  lastInterviewAt: null,
  streakDays: 0,
  xp: 0,
  level: 1,
  strongTopics: [],
  weakTopics: [],
  weeklyHours: [],
  monthlyHours: [],
};

function buildStatistics(progress) {
  return {
    interviewCount: progress?.totalInterviews ?? 0,
    practiceHours: progress?.practiceHours ?? 0,
    averageScore: progress?.averageScore ?? 0,
    streakDays: progress?.streakDays ?? 0,
    xp: progress?.xp ?? 0,
    level: progress?.level ?? 1,
    strongTopicCount: (progress?.strongTopics || []).length,
    weakTopicCount: (progress?.weakTopics || []).length,
    lastInterviewAt: progress?.lastInterviewAt ?? null,
  };
}

function normalizeProgressData(progress) {
  if (!progress) return DEFAULT_SUMMARY;

  return {
    totalInterviews: progress.totalInterviews ?? 0,
    practiceHours: progress.practiceHours ?? 0,
    averageScore: progress.averageScore ?? 0,
    lastInterviewAt: progress.lastInterviewAt ?? null,
    streakDays: progress.streakDays ?? 0,
    xp: progress.xp ?? 0,
    level: progress.level ?? 1,
    strongTopics: progress.strongTopics ?? [],
    weakTopics: progress.weakTopics ?? [],
    weeklyHours: progress.weeklyHours ?? [],
    monthlyHours: progress.monthlyHours ?? [],
  };
}

export async function getDashboardSummary(userId) {
  const progress = await Progress.findOne({ userId }).lean().exec();
  return normalizeProgressData(progress);
}

export async function getWeeklyProgress(userId) {
  const progress = await Progress.findOne({ userId }).lean().exec();
  return {
    weeklyHours: progress?.weeklyHours ?? [],
    meta: {
      empty: !progress || !progress.weeklyHours?.length,
      note: 'Weekly progress may be empty until you complete interview sessions or practice hours.',
    },
  };
}

export async function getMonthlyProgress(userId) {
  const progress = await Progress.findOne({ userId }).lean().exec();
  return {
    monthlyHours: progress?.monthlyHours ?? [],
    meta: {
      empty: !progress || !progress.monthlyHours?.length,
      note: 'Monthly progress may be empty until you complete interview sessions or practice hours.',
    },
  };
}

export async function getDashboardTopics(userId, type) {
  const progress = await Progress.findOne({ userId }).lean().exec();
  if (type === 'strong') {
    return { topics: progress?.strongTopics ?? [] };
  }
  if (type === 'weak') {
    return { topics: progress?.weakTopics ?? [] };
  }
  throw new Error('Unsupported topic type');
}

export async function getDashboardStatistics(userId) {
  const progress = await Progress.findOne({ userId }).lean().exec();
  return buildStatistics(progress);
}
