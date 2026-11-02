import mongoose from 'mongoose';
import { Resume } from '../../models/index.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

export async function createResumeRecord(data) {
  return Resume.create(data);
}

export async function listResumesByUser(userId, { page = 1, limit = 10 } = {}) {
  const safePage = Number.parseInt(page, 10) >= 1 ? Number.parseInt(page, 10) : 1;
  const safeLimit = Number.parseInt(limit, 10) >= 1 ? Number.parseInt(limit, 10) : 10;
  const skip = (safePage - 1) * safeLimit;

  const [resumes, total] = await Promise.all([
    Resume.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean()
      .exec(),
    Resume.countDocuments({ userId }).exec(),
  ]);

  return {
    resumes,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function getResumeById(userId, resumeId) {
  if (!isValidObjectId(resumeId)) return null;
  return Resume.findOne({ _id: resumeId, userId }).lean().exec();
}

export async function softDeleteResume(userId, resumeId) {
  if (!isValidObjectId(resumeId)) return null;
  const resume = await Resume.findOne({ _id: resumeId, userId }).exec();
  if (!resume) return null;
  await resume.softDelete(userId);
  return resume.toObject();
}
