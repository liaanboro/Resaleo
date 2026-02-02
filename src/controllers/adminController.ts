
import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import User from '../models/User';
import Listing from '../models/Listing';
import Chat from '../models/Chat';
import Message from '../models/Message';
import Report from '../models/Report';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const activeChats = await Chat.countDocuments(); // Approximate activity
    const reportedItems = await Report.countDocuments({ status: 'pending' });

    res.json({
        totalUsers,
        totalListings,
        activeChats,
        reportedItems
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({})
        .select('-password')
        .sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleUserBlock = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, isBlocked: user.isBlocked });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all listings
// @route   GET /api/admin/listings
// @access  Private/Admin
export const getListings = asyncHandler(async (req: Request, res: Response) => {
    const listings = await Listing.find({})
        .populate('sellerId', 'name email')
        .sort({ createdAt: -1 });
    res.json(listings);
});

// @desc    Delete or update listing status
// @route   DELETE /api/admin/listings/:id
// @access  Private/Admin
export const deleteListing = asyncHandler(async (req: Request, res: Response) => {
    const listing = await Listing.findById(req.params.id);
    if (listing) {
        await Listing.deleteOne({ _id: listing._id });
        res.json({ message: 'Listing removed' });
    } else {
        res.status(404);
        throw new Error('Listing not found');
    }
});

// @desc    Update listing status (Approve/Reject)
// @route   PUT /api/admin/listings/:id/status
// @access  Private/Admin
export const updateListingStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (listing) {
        listing.status = status;
        await listing.save();
        res.json(listing);
    } else {
        res.status(404);
        throw new Error('Listing not found');
    }
});

// @desc    Get all chats
// @route   GET /api/admin/chats
// @access  Private/Admin
export const getChats = asyncHandler(async (req: Request, res: Response) => {
    /* 
       Search functionality: 
       This is a bit complex with Mongoose only, but we can do basic filtering.
       For advanced search (by user name), we might need aggregation.
    */
    const chats = await Chat.find({})
        .populate('participants', 'name email avatar')
        .populate('listingId', 'title')
        .sort({ lastMessageAt: -1 });

    res.json(chats);
});

// @desc    Get messages for a chat
// @route   GET /api/admin/chats/:id/messages
// @access  Private/Admin
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const messages = await Message.find({ chatId: req.params.id })
        .populate('senderId', 'name email')
        .sort({ createdAt: 1 });
    res.json(messages);
});

// @desc    Delete a message
// @route   DELETE /api/admin/messages/:id
// @access  Private/Admin
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const message = await Message.findById(req.params.id);
    if (message) {
        await Message.deleteOne({ _id: message._id });
        res.json({ message: 'Message deleted' });
    } else {
        res.status(404);
        throw new Error('Message not found');
    }
});

// @desc    Delete entire chat
// @route   DELETE /api/admin/chats/:id
// @access  Private/Admin
export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
    const chat = await Chat.findById(req.params.id);
    if (chat) {
        await Message.deleteMany({ chatId: chat._id });
        await Chat.deleteOne({ _id: chat._id });
        res.json({ message: 'Chat and messages deleted' });
    } else {
        res.status(404);
        throw new Error('Chat not found');
    }
});

// @desc    Get reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getReports = asyncHandler(async (req: Request, res: Response) => {
    const reports = await Report.find({})
        .populate('reporterId', 'name')
        .populate('reportedId', 'name')
        .sort({ createdAt: -1 });
    res.json(reports);
});

// @desc    Resolve report
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
export const updateReportStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    if (report) {
        report.status = status;
        await report.save();
        res.json(report);
    } else {
        res.status(404);
        throw new Error('Report not found');
    }
});
