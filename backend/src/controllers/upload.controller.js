import { Upload } from '../models/index.js';
import { deleteFile, uploadFileFromBuffer } from '../services/upload.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

export async function uploadFile(req, res) {
  let cloudinaryResult;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folder = req.body.folder ? String(req.body.folder).trim() : 'mock-interview/uploads';
    const publicId = req.body.publicId ? String(req.body.publicId).trim() : undefined;
    const userId = req.user?._id ? String(req.user._id) : undefined;
    const category = req.body.category ? String(req.body.category).trim() : 'generic';

    cloudinaryResult = await uploadFileFromBuffer(req.file.buffer, req.file.mimetype, {
      folder,
      public_id: publicId,
      userId,
    });

    const uploadDocument = await Upload.create({
      userId: userId || undefined,
      category,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size || 0,
      resourceType: cloudinaryResult.resource_type,
      publicId: cloudinaryResult.public_id,
      url: cloudinaryResult.url || cloudinaryResult.secure_url,
      secureUrl: cloudinaryResult.secure_url || cloudinaryResult.url,
      folder: cloudinaryResult.folder,
      provider: 'cloudinary',
    });

    return success(res, {
      file: {
        id: uploadDocument._id,
        originalName: uploadDocument.originalName,
        publicId: uploadDocument.publicId,
        url: uploadDocument.url,
        secureUrl: uploadDocument.secureUrl,
        resourceType: uploadDocument.resourceType,
        mimeType: uploadDocument.mimeType,
        size: uploadDocument.size,
        folder: uploadDocument.folder,
        category: uploadDocument.category,
      },
    }, 'File uploaded successfully');
  } catch (err) {
    console.error('UploadFile error', err);

    if (cloudinaryResult?.public_id) {
      try {
        await deleteFile(cloudinaryResult.public_id, cloudinaryResult.resource_type);
      } catch (purgeErr) {
        console.warn('Failed to clean up Cloudinary upload after DB failure', purgeErr);
      }
    }

    return res.status(500).json({ success: false, message: 'Failed to upload file' });
  }
}
