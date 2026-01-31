import { Request, Response } from 'express';
import Listing from '../models/Listing';

// @desc    Get all listings (with filters)
// @route   GET /api/listings
// @access  Public
export const getListings = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice, search, lat, lng, radius } = req.query;

        let query: any = { status: 'Active' };

        // Search Filter
        if (search) {
            query.$text = { $search: search as string };
        }

        // Category Filter
        if (category) {
            query.category = category;
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
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

        const listings = await Listing.find(query).populate('sellerId', 'name avatar isVerified rating');

        res.json(listings);
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req: Request, res: Response) => {
    const listing = await Listing.findById(req.params.id).populate('sellerId', 'name avatar phone isVerified joinedAt');

    if (listing) {
        res.json(listing);
    } else {
        res.status(404);
        throw new Error('Listing not found');
    }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req: Request, res: Response) => {
    const { title, description, price, category, condition, location, address } = req.body;

    // Images handled by multer, paths are in req.files
    const files = req.files as Express.Multer.File[];
    const imageUrls = files ? files.map(file => file.path) : [];

    if (!location) {
        res.status(400);
        throw new Error('Location is required');
    }

    // Parse location if it comes as stringified JSON (common in multipart forms)
    let parsedLocation;
    try {
        parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (e) {
        parsedLocation = { coordinates: [0, 0], address: 'Unknown' }; // Fallback
    }

    const listing = await Listing.create({
        sellerId: (req as any).user._id,
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
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req: Request, res: Response) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    // Check ownership
    if (listing.sellerId.toString() !== (req as any).user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this listing');
    }

    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
};
