import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'resaleo-items',
            format: 'jpeg', // compress to jpeg
            public_id: file.fieldname + '-' + Date.now(),
            transformation: [{ width: 1000, crop: "limit" }] // Resize if too large
        };
    },
});

export const upload = multer({ storage: storage });
export { cloudinary };
