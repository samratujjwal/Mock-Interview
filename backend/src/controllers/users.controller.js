import { User } from '../models/index.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { uploadImageFromBuffer, deleteImage } from '../services/upload.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

export async function getMe(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    return success(res, { user }, 'User retrieved');
  } catch (err) {
    console.error('GetMe error', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user' });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    // Fetch current user to inspect existing avatar
    const currentUser = await User.findById(userId).exec();
    if (!currentUser) return res.status(404).json({ success: false, message: 'User not found' });

    const allowed = ['name'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // If an avatar file was uploaded, validate and send to Cloudinary and delete old image after successful upload
    if (req.file && req.file.buffer) {
      // Double-check mime type and size as a safe guard (multer enforces these but be defensive)
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const fileType = req.file.mimetype;
      const fileSize = req.file.size || 0;
      const maxAllowed = parseInt(process.env.AVATAR_MAX_SIZE_BYTES || String(5 * 1024 * 1024), 10);

      if (!allowed.includes(fileType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.' });
      }
      if (fileSize > maxAllowed) {
        return res.status(400).json({ success: false, message: `File too large. Max size is ${Math.round(maxAllowed / 1024)} KB.` });
      }

      try {
        const result = await uploadImageFromBuffer(req.file.buffer, req.file.mimetype, {
          userId: String(userId),
          folder: 'mock-interview/avatars',
        });

        updates.avatar = {
          url: result.secure_url,
          publicId: result.public_id,
          secureUrl: result.secure_url,
        };

        // If there was an old avatar publicId and it differs from new, attempt to delete it
        const oldPublicId = currentUser.avatar?.publicId;
        if (oldPublicId && oldPublicId !== result.public_id) {
          try {
            await deleteImage(oldPublicId);
          } catch (delErr) {
            // Log but do not fail the whole request
            console.warn('Failed to delete old avatar from Cloudinary', delErr);
          }
        }
      } catch (uploadErr) {
        console.error('Avatar upload failed', uploadErr);
        return res.status(500).json({ success: false, message: 'Failed to upload avatar' });
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return success(res, { user }, 'Profile updated');
  } catch (err) {
    console.error('UpdateProfile error', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
}

export async function deleteAvatar(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const publicId = user.avatar?.publicId;
    if (!publicId) return success(res, { user }, 'No avatar to delete');

    try {
      await deleteImage(publicId);
    } catch (delErr) {
      console.warn('Failed to delete avatar from Cloudinary', delErr);
      // Proceed to clear avatar locally even if remote deletion failed
    }

    user.avatar = { publicId: null, url: null, secureUrl: null };
    await user.save();

    return success(res, { user }, 'Avatar deleted');
  } catch (err) {
    console.error('DeleteAvatar error', err);
    return res.status(500).json({ success: false, message: 'Failed to delete avatar' });
  }
}

export async function deleteAccount(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Attempt to remove avatar from Cloudinary if present
    const publicId = user.avatar?.publicId;
    if (publicId) {
      try {
        await deleteImage(publicId);
      } catch (delErr) {
        console.warn('Failed to delete avatar during account deletion', delErr);
      }
    }

    // Soft-delete using plugin method
    await user.softDelete(userId);

    // Revoke refresh tokens belonging to user
    await RefreshToken.updateMany({ userId, revoked: false }, { revoked: true }).exec();

    return success(res, {}, 'Account deleted');
  } catch (err) {
    console.error('DeleteAccount error', err);
    return res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
}
