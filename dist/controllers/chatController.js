"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getUserChats = exports.startChat = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
// @desc    Start or Get existing Chat
// @route   POST /api/chats
// @access  Private
exports.startChat = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listingId, receiverId } = req.body;
    const senderId = req.user._id;
    if (!listingId || !receiverId) {
        res.status(400);
        throw new Error('Listing ID and Receiver ID are required');
    }
    // Check if chat exists
    let chat = yield Chat_1.default.findOne({
        listingId,
        participants: { $all: [senderId, receiverId] }
    }).populate('participants', 'name avatar email');
    if (chat) {
        res.status(200).json(chat);
        return;
    }
    // Create new chat
    chat = yield Chat_1.default.create({
        listingId,
        participants: [senderId, receiverId],
        lastMessage: 'Started a conversation',
        lastMessageAt: new Date()
    });
    chat = yield chat.populate('participants', 'name avatar email');
    res.status(201).json(chat);
}));
// @desc    Get User Chats
// @route   GET /api/chats
// @access  Private
exports.getUserChats = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield Chat_1.default.find({
        participants: { $in: [req.user._id] }
    })
        .populate('participants', 'name avatar')
        .populate('listingId', 'title price images')
        .sort({ lastMessageAt: -1 });
    res.status(200).json(chats);
}));
// @desc    Get Chat Messages
// @route   GET /api/chats/:chatId/messages
// @access  Private
exports.getMessages = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    const messages = yield Message_1.default.find({ chatId })
        .populate('senderId', 'name avatar')
        .sort({ createdAt: 1 });
    res.status(200).json(messages);
}));
// @desc    Send Message
// @route   POST /api/messages
// @access  Private
// NOTE: This usually complements socket.io, saving to DB
exports.sendMessage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, content } = req.body;
    if (!chatId || !content) {
        res.status(400);
        throw new Error('Chat ID and content are required');
    }
    let message = yield Message_1.default.create({
        chatId,
        senderId: req.user._id,
        content
    });
    message = yield message.populate('senderId', 'name avatar');
    message = yield message.populate('chatId');
    // Update last message in chat
    yield Chat_1.default.findByIdAndUpdate(chatId, {
        lastMessage: content,
        lastMessageAt: new Date()
    });
    res.status(201).json(message);
}));
