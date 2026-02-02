
import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import User from '../models/User';
import Report from '../models/Report';

// Extend Request to include user
interface AuthenticatedRequest extends Request {
    user?: any;
}

// @desc    Block a user
// @route   POST /api/users/block
// @access  Private
export const blockUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { userIdToBlock } = req.body;
    const userId = req.user._id;

    if (!userIdToBlock) {
        res.status(400);
        throw new Error('User ID to block is required');
    }

    if (userId.toString() === userIdToBlock) {
        res.status(400);
        throw new Error('You cannot block yourself');
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.blockedUsers.includes(userIdToBlock)) {
        res.status(400);
        throw new Error('User already blocked');
    }

    user.blockedUsers.push(userIdToBlock);
    await user.save();

    res.status(200).json({ message: 'User blocked successfully' });
});

// @desc    Report a user
// @route   POST /api/users/report
// @access  Private
export const reportUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { reportedId, reason, description } = req.body;
    const reporterId = req.user._id;

    if (!reportedId || !reason) {
        res.status(400);
        throw new Error('Reported User ID and reason are required');
    }

    await Report.create({
        reporterId,
        reportedId,
        reason,
        description
    });

    res.status(201).json({ message: 'User reported successfully' });
});
