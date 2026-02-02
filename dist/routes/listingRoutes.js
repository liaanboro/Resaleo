"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const listingController_1 = require("../controllers/listingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const cloudinary_1 = require("../config/cloudinary");
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const router = express_1.default.Router();
router.route('/')
    .get((0, asyncHandler_1.default)(listingController_1.getListings))
    .post(authMiddleware_1.protect, cloudinary_1.upload.array('images', 10), (0, asyncHandler_1.default)(listingController_1.createListing));
router.route('/:id')
    .get((0, asyncHandler_1.default)(listingController_1.getListingById))
    .delete(authMiddleware_1.protect, (0, asyncHandler_1.default)(listingController_1.deleteListing));
exports.default = router;
