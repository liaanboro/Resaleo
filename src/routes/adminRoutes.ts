
import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';
import {
    getStats,
    getUsers,
    toggleUserBlock,
    getListings,
    deleteListing,
    updateListingStatus,
    getChats,
    getMessages,
    deleteMessage,
    deleteChat,
    getReports,
    updateReportStatus
} from '../controllers/adminController';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleUserBlock);
router.get('/listings', getListings);
router.delete('/listings/:id', deleteListing);
router.put('/listings/:id/status', updateListingStatus);
router.get('/chats', getChats);
router.get('/chats/:id/messages', getMessages);
router.delete('/messages/:id', deleteMessage);
router.delete('/chats/:id', deleteChat);
router.get('/reports', getReports);
router.put('/reports/:id', updateReportStatus);

export default router;
