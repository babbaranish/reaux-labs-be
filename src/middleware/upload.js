import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const createStorage = (folder, allowedFormats) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `reaux-labs/${folder}`,
      allowed_formats: allowedFormats,
      resource_type: 'auto',
    },
  });

// heic/heif included because many phones shoot in those formats by default.
const imageFormats = ['jpeg', 'jpg', 'png', 'webp', 'heic', 'heif'];
const videoFormats = ['mp4', 'mov', 'avi'];

// Phone photos routinely exceed 5MB, which was silently failing uploads.
const IMAGE_SIZE_LIMIT = 15 * 1024 * 1024;

export const uploadProfileImage = multer({
  storage: createStorage('profiles', imageFormats),
  limits: { fileSize: IMAGE_SIZE_LIMIT },
});

export const uploadPostMedia = multer({
  storage: createStorage('posts', [...imageFormats, ...videoFormats]),
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const uploadReelVideo = multer({
  storage: createStorage('reels', [...videoFormats, ...imageFormats]),
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const uploadDietImage = multer({
  storage: createStorage('diets', imageFormats),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProductImages = multer({
  storage: createStorage('products', imageFormats),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadGymImages = multer({
  storage: createStorage('gyms', imageFormats),
  limits: { fileSize: 5 * 1024 * 1024 },
});
