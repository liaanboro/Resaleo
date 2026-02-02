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
exports.deleteListing = exports.createListing = exports.getListingById = exports.getListings = void 0;
const Listing_1 = __importDefault(require("../models/Listing"));
// @desc    Get all listings (with filters)
// @route   GET /api/listings
// @access  Public
const getListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, minPrice, maxPrice, search, lat, lng, radius } = req.query;
        let query = { status: 'Active' };
        // Search Filter
        if (search) {
            query.$text = { $search: search };
        }
        // Category Filter
        if (category) {
            query.category = category;
        }
        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        // Location Filter (GeoSpatial)
        // Radius in km (default 50km)
        if (lat && lng) {
            const distanceInMeters = (Number(radius) || 50) * 1000;
            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)]
                    },
                    $maxDistance: distanceInMeters
                }
            };
        }
        const listings = yield Listing_1.default.find(query).populate('sellerId', 'name avatar isVerified rating');
        res.json(listings);
    }
    catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
});
exports.getListings = getListings;
// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield Listing_1.default.findById(req.params.id).populate('sellerId', 'name avatar phone isVerified joinedAt');
    if (listing) {
        res.json(listing);
    }
    else {
        res.status(404);
        throw new Error('Listing not found');
    }
});
exports.getListingById = getListingById;
// @desc    Create a listing
// @route   POST /api/listings
// @access  Private
const createListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, category, condition, location, address } = req.body;
    // Images handled by multer, paths are in req.files
    // Images handled by multer, paths are in req.files
    const files = req.files;
    const imageUrls = files ? files.map(file => {
        // If the path is already a URL (Cloudinary), use it
        if (file.path.startsWith('http')) {
            return file.path;
        }
        // Otherwise it's a local file path, construct the URL
        // We serve 'uploads' statically at /uploads
        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    }) : [];
    if (!location) {
        res.status(400);
        throw new Error('Location is required');
    }
    // Parse location if it comes as stringified JSON (common in multipart forms)
    let parsedLocation;
    try {
        parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    }
    catch (e) {
        parsedLocation = { coordinates: [0, 0], address: 'Unknown' }; // Fallback
    }
    const listing = yield Listing_1.default.create({
        sellerId: req.user._id,
        title,
        description,
        price,
        category,
        condition,
        images: imageUrls,
        location: {
            type: 'Point',
            coordinates: parsedLocation.coordinates || [0, 0], // expects [lng, lat]
            address: address || parsedLocation.address
        }
    });
    res.status(201).json(listing);
});
exports.createListing = createListing;
// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield Listing_1.default.findById(req.params.id);
    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }
    // Check ownership
    if (listing.sellerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this listing');
    }
    yield listing.deleteOne();
    res.json({ message: 'Listing removed' });
});
exports.deleteListing = deleteListing;
