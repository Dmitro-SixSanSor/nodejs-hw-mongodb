import cloudinary from '../utils/cloudinary.js';
import fs from 'fs/promises';

export const uploadImage = async (localPath) => {
  try {
    const folder = process.env.CLOUDINARY_FOLDER || 'contacts';
    const res = await cloudinary.uploader.upload(localPath, { folder });
    return res.secure_url;
  } finally {
    try {
      await fs.unlink(localPath);
    } catch {}
  }
};
