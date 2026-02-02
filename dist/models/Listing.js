"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const listingSchema = new mongoose_1.default.Schema({
    sellerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Vehicles',
            'Electronics',
            'Furniture',
            'Properties',
            'Fashion',
            'Hobbies',
            'Services',
            'Jobs',
            'Others'
        ]
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Used', 'Damaged'],
        required: [true, 'Please specify the condition']
    },
    images: {
        type: [String],
        validate: [(val) => val.length <= 10, 'Exceeds the limit of 10 images']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['Active', 'Sold', 'Expired', 'Banned'],
        default: 'Active'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
// Geospatial Index for location-based search
listingSchema.index({ location: '2dsphere' });
// Text Index for search
listingSchema.index({ title: 'text', description: 'text', category: 'text' });
exports.default = mongoose_1.default.model('Listing', listingSchema);
