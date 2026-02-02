import { Response, Request } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import Chat from '../models/Chat';
import Message from '../models/Message';
// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
    user?: any;
}

// @desc    Start or Get existing Chat
// @route   POST /api/chats
// @access  Private
export const startChat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { listingId, receiverId } = req.body;
    const senderId = req.user._id;

    if (!listingId || !receiverId) {
        res.status(400);
        throw new Error('Listing ID and Receiver ID are required');
    }

    // Check if chat exists
    let chat = await Chat.findOne({
        listingId,
        participants: { $all: [senderId, receiverId] }
    }).populate('participants', 'name avatar email');

    if (chat) {
        res.status(200).json(chat);
        return;
    }

    // Create new chat
    chat = await Chat.create({
        listingId,
        participants: [senderId, receiverId],
        lastMessage: 'Started a conversation',
        lastMessageAt: new Date()
    });

    chat = await chat.populate('participants', 'name avatar email');

    res.status(201).json(chat);
});

// @desc    Get User Chats
// @route   GET /api/chats
// @access  Private
export const getUserChats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const chats = await Chat.find({
        participants: { $in: [req.user._id] }
    })
        .populate('participants', 'name avatar')
        .populate('listingId', 'title price images')
        .sort({ lastMessageAt: -1 });

    res.status(200).json(chats);
});

// @desc    Get Chat Messages
// @route   GET /api/chats/:chatId/messages
// @access  Private
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
        .populate('senderId', 'name avatar')
        .sort({ createdAt: 1 });

    res.status(200).json(messages);
});

// @desc    Upload chat image
// @route   POST /api/chats/upload
// @access  Private
export const uploadChatImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No image uploaded');
    }

    let imageUrl;

    // Check if using Cloudinary (has secure_url)
    if ((req.file as any).secure_url) {
        imageUrl = (req.file as any).secure_url;
    } else {
        // Local Multer - construct accessible URL
        // Assuming app uses '/uploads' static route
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    res.status(200).json({ url: imageUrl });
});

// @desc    Send Message
// @route   POST /api/messages
// @access  Private
// NOTE: This usually complements socket.io, saving to DB
export const sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { chatId, content, messageType, mediaUrl } = req.body;

    if (!chatId || !content) {
        res.status(400);
        throw new Error('Chat ID and content are required');
    }

    let message = await Message.create({
        chatId,
        senderId: req.user._id,
        content,
        messageType: messageType || 'text',
        mediaUrl
    });

    message = await message.populate('senderId', 'name avatar');
    message = await message.populate('chatId');

    // Update last message in chat
    await Chat.findByIdAndUpdate(chatId, {
        lastMessage: content,
        lastMessageAt: new Date()
    });

    res.status(201).json(message);
});
