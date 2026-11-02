import { deleteFile, uploadFileFromBuffer } from '../services/upload.service.js';
import {
  createResumeRecord,
  listResumesByUser,
  getResumeById,
  softDeleteResume,
} from '../services/resume/resume.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message) {
  return res.status(status).json({ success: false, message, data: {} });
}

export async function uploadResume(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');
    if (!req.file || !req.file.buffer) return error(res, 400, 'Resume file is required');

    const fileType = req.file.mimetype;
    if (fileType !== 'application/pdf') {
      return error(res, 400, 'Only PDF resume uploads are supported at this time');
    }

    let uploadResult = null;

    try {
      uploadResult = await uploadFileFromBuffer(req.file.buffer, req.file.mimetype, {
        folder: 'mock-interview/resumes',
        userId: String(userId),
      });

      const resume = await createResumeRecord({
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

      return success(res, { resume }, 'Resume uploaded successfully');
    } catch (err) {
      if (uploadResult?.public_id) {
        try {
          await deleteFile(uploadResult.public_id, uploadResult.resource_type);
        } catch (cleanupErr) {
          console.warn('Failed to cleanup Cloudinary resume upload after DB failure', cleanupErr);
        }
      }

      console.error('Upload resume error', err);
      return error(res, 500, 'Failed to upload resume');
    }
  } catch (err) {
    console.error('Upload resume error', err);
    return error(res, 500, 'Failed to upload resume');
  }
}

export async function listResumes(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { page = 1, limit = 10 } = req.query;
    const result = await listResumesByUser(String(userId), { page, limit });
    return success(res, { resumes: result.resumes, meta: result.meta }, 'Resumes retrieved');
  } catch (err) {
    console.error('List resumes error', err);
    return error(res, 500, 'Failed to retrieve resumes');
  }
}

export async function getResume(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    const resume = await getResumeById(String(userId), id);
    if (!resume) return error(res, 404, 'Resume not found');

    return success(res, { resume }, 'Resume retrieved');
  } catch (err) {
    console.error('Get resume error', err);
    return error(res, 500, 'Failed to retrieve resume');
  }
}

export async function deleteResume(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    const deleted = await softDeleteResume(String(userId), id);
    if (!deleted) return error(res, 404, 'Resume not found');

    return success(res, { resume: deleted }, 'Resume deleted');
  } catch (err) {
    console.error('Delete resume error', err);
    return error(res, 500, 'Failed to delete resume');
  }
}
