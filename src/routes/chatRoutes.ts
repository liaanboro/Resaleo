import express from 'express';
import {
    startChat,
    getUserChats,
    getMessages,
    sendMessage,
    uploadChatImage
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';
import asyncHandler from '../middleware/asyncHandler';

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
    .post(asyncHandler(startChat))
    .get(asyncHandler(getUserChats));

router.route('/:chatId/messages')
    .get(asyncHandler(getMessages));

router.route('/messages')
    .post(asyncHandler(sendMessage));

router.route('/upload')
    .post(upload.single('image'), asyncHandler(uploadChatImage));

export default router;
