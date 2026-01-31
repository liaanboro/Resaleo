import express from 'express';
import {
    getListings,
    getListingById,
    createListing,
    deleteListing
} from '../controllers/listingController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';
import asyncHandler from '../middleware/asyncHandler';

const router = express.Router();

router.route('/')
    .get(asyncHandler(getListings))
    .post(protect, upload.array('images', 10), asyncHandler(createListing));

router.route('/:id')
    .get(asyncHandler(getListingById))
    .delete(protect, asyncHandler(deleteListing));

export default router;
