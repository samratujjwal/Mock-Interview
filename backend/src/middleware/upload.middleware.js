import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_AVATAR_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const DEFAULT_FILE_MAX_BYTES = 15 * 1024 * 1024; // 15MB

const avatarMaxSize = parseInt(process.env.AVATAR_MAX_SIZE_BYTES || String(DEFAULT_AVATAR_MAX_BYTES), 10);
const fileMaxSize = parseInt(process.env.UPLOAD_MAX_SIZE_BYTES || String(DEFAULT_FILE_MAX_BYTES), 10);

const avatarAllowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const fileAllowedMimes = [
  ...avatarAllowedMimes,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const storage = multer.memoryStorage();

function createFileFilter(allowedMimes, errorMessage) {
  return (req, file, cb) => {
    if (!file || !file.mimetype) return cb(null, false);
    if (allowedMimes.includes(file.mimetype)) return cb(null, true);

    const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    err.message = errorMessage;
    return cb(err, false);
  };
}

export const avatarUpload = multer({
  storage,
  limits: { fileSize: avatarMaxSize },
  fileFilter: createFileFilter(
    avatarAllowedMimes,
    'Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.'
  ),
});

const resumeMaxSize = parseInt(process.env.RESUME_MAX_SIZE_BYTES || String(10 * 1024 * 1024), 10);
const resumeAllowedMimes = ['application/pdf'];

export const fileUpload = multer({
  storage,
  limits: { fileSize: fileMaxSize },
  fileFilter: createFileFilter(
    fileAllowedMimes,
    'Invalid file type. Only JPEG, PNG, WEBP, GIF, PDF, DOC and DOCX are allowed.'
  ),
});

export const resumeUpload = multer({
  storage,
  limits: { fileSize: resumeMaxSize },
  fileFilter: createFileFilter(
    resumeAllowedMimes,
    'Invalid file type. Only PDF resumes are allowed at this time.'
  ),
});

const upload = avatarUpload;
export default upload;
