import mongoose from 'mongoose';
import { JobDescription } from '../../models/index.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

export async function createJobDescriptionRecord(data) {
  return JobDescription.create(data);
}

export async function listJDsByUser(userId, { page = 1, limit = 10 } = {}) {
  const safePage = Number.parseInt(page, 10) >= 1 ? Number.parseInt(page, 10) : 1;
  const safeLimit = Number.parseInt(limit, 10) >= 1 ? Number.parseInt(limit, 10) : 10;
  const skip = (safePage - 1) * safeLimit;

  const [jds, total] = await Promise.all([
    JobDescription.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean().exec(),
    JobDescription.countDocuments({ userId }).exec(),
  ]);

  return {
    jobDescriptions: jds,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function getJDById(userId, jdId) {
  if (!isValidObjectId(jdId)) return null;
  return JobDescription.findOne({ _id: jdId, userId }).lean().exec();
}

export async function softDeleteJD(userId, jdId) {
  if (!isValidObjectId(jdId)) return null;
  const jd = await JobDescription.findOne({ _id: jdId, userId }).exec();
  if (!jd) return null;
  await jd.softDelete(userId);
  return jd.toObject();
}
