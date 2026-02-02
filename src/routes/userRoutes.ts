
import express from 'express';
import { blockUser, reportUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All routes protected

router.post('/block', blockUser);
router.post('/report', reportUser);

export default router;
