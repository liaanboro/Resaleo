import express from 'express';
import {
    startChat,
    getUserChats,
    getMessages,
    sendMessage
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
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

export default router;
