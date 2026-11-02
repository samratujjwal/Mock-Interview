import cloudinary from '../config/cloudinary.js';

const DEFAULT_UPLOAD_FOLDER = 'mock-interview/uploads';

function buildPublicId(options = {}) {
  if (options.public_id) return options.public_id;
  if (options.userId) return `user_${options.userId}_${Date.now()}`;
  return `upload_${Date.now()}`;
}

function determineResourceType(mimetype, explicitResourceType) {
  if (explicitResourceType) return explicitResourceType;
  if (!mimetype) return 'raw';
  return mimetype.startsWith('image/') ? 'image' : 'raw';
}

export async function uploadFileFromBuffer(buffer, mimetype, options = {}) {
  if (!cloudinary || !cloudinary.uploader) {
    throw new Error('Cloudinary is not configured');
  }

  const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;
  const resourceType = determineResourceType(mimetype, options.resource_type || options.resourceType);
  const publicId = buildPublicId(options);

  const uploadOptions = {
    folder: options.folder || DEFAULT_UPLOAD_FOLDER,
    public_id: publicId,
    overwrite: false,
    resource_type: resourceType,
  };

  if (resourceType === 'image') {
    uploadOptions.transformation = options.transformation || { width: 512, height: 512, crop: 'limit' };
  }

  const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
  return result;
}

export async function uploadImageFromBuffer(buffer, mimetype, options = {}) {
  return uploadFileFromBuffer(buffer, mimetype, {
    ...options,
    resource_type: 'image',
    transformation: options.transformation || { width: 512, height: 512, crop: 'limit' },
  });
}

export async function deleteFile(publicId, resourceType = 'image') {
  if (!publicId) return { result: 'not_found', publicId };
  if (!cloudinary || !cloudinary.uploader) {
    throw new Error('Cloudinary is not configured');
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  return result;
}

export async function deleteImage(publicId) {
  return deleteFile(publicId, 'image');
}

export default { uploadFileFromBuffer, uploadImageFromBuffer, deleteFile, deleteImage };
