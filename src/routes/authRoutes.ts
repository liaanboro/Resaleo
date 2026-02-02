import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import asyncHandler from '../middleware/asyncHandler';

// Instead of express-async-handler, we can wrap routes or use a simple try-catch in controller. 
// For cleaner code, I recommend creating a wrapper or using a library. 
// However, since I used throw Error in controllers, I need to wrap them to catch async errors.
// Currently standard Express 4.x doesn't handle async errors automatically (Express 5 does).
// I will implement a quick asyncHandler utility inline or separate.

// Let's assume we use a simple inline wrapper for now, or use express-async-handler if installed.
// I didn't install `express-async-handler`. I'll create a `middleware/asyncHandler.ts`.

const router = express.Router();


router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.post('/logout', logoutUser);
router.get('/profile', protect, asyncHandler(getUserProfile));

export default router;
