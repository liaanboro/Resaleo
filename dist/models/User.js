"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true // Allow null/undefined to not conflict (for email-only users initially)
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'business'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        },
        city: String,
        formattedAddress: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    badges: [String],
    favorites: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Listing'
        }]
}, {
    timestamps: true
});
// Geospacial Index
userSchema.index({ location: '2dsphere' });
exports.default = mongoose_1.default.model('User', userSchema);
