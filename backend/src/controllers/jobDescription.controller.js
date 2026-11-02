import { deleteFile, uploadFileFromBuffer } from '../services/upload.service.js';
import {
  createJobDescriptionRecord,
  listJDsByUser,
  getJDById,
  softDeleteJD,
} from '../services/jd/jd.service.js';
import { scheduleJDParseById } from '../services/jd/parse.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message) {
  return res.status(status).json({ success: false, message, data: {} });
}

export async function uploadJD(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');
    if (!req.file || !req.file.buffer) return error(res, 400, 'Job description file is required');

    const fileType = String(req.file.mimetype || '').toLowerCase();
    if (!['application/pdf', 'text/plain'].includes(fileType)) {
      return error(res, 400, 'Only PDF or plain text JD uploads are supported at this time');
    }

    let uploadResult = null;
    try {
      uploadResult = await uploadFileFromBuffer(req.file.buffer, req.file.mimetype, {
        folder: 'mock-interview/jds',
        userId: String(userId),
      });

      const jd = await createJobDescriptionRecord({
        userId,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size || 0,
        resourceType: uploadResult.resource_type,
        publicId: uploadResult.public_id,
        url: uploadResult.url || uploadResult.secure_url,
        secureUrl: uploadResult.secure_url || uploadResult.url,
        folder: uploadResult.folder,
        provider: 'cloudinary',
      });

      return success(res, { jd }, 'Job description uploaded successfully');
    } catch (err) {
      if (uploadResult?.public_id) {
        try {
          await deleteFile(uploadResult.public_id, uploadResult.resource_type);
        } catch (cleanupErr) {
          console.warn('Failed to cleanup Cloudinary JD upload after DB failure', cleanupErr);
        }
      }
      console.error('Upload JD error', err);
      return error(res, 500, 'Failed to upload job description');
    }
  } catch (err) {
    console.error('Upload JD error', err);
    return error(res, 500, 'Failed to upload job description');
  }
}

export async function listJDs(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { page = 1, limit = 10 } = req.query;
    const result = await listJDsByUser(String(userId), { page, limit });
    return success(res, { jobDescriptions: result.jobDescriptions, meta: result.meta }, 'Job descriptions retrieved');
  } catch (err) {
    console.error('List JDs error', err);
    return error(res, 500, 'Failed to retrieve job descriptions');
  }
}

export async function getJD(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    const jd = await getJDById(String(userId), id);
    if (!jd) return error(res, 404, 'Job description not found');

    return success(res, { jd }, 'Job description retrieved');
  } catch (err) {
    console.error('Get JD error', err);
    return error(res, 500, 'Failed to retrieve job description');
  }
}

export async function deleteJD(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    const deleted = await softDeleteJD(String(userId), id);
    if (!deleted) return error(res, 404, 'Job description not found');

    return success(res, { jd: deleted }, 'Job description deleted');
  } catch (err) {
    console.error('Delete JD error', err);
    return error(res, 500, 'Failed to delete job description');
  }
}

export async function parseJD(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Job description id is required');

    const jd = await scheduleJDParseById(String(userId), id);
    if (!jd) return error(res, 404, 'Job description not found');

    return success(res, { jd }, 'Job description parse scheduled');
  } catch (err) {
    console.error('Parse JD error', err);
    return error(res, 500, 'Failed to parse job description');
  }
}
