import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Geospacial Index
userSchema.index({ location: '2dsphere' });

export default mongoose.model('User', userSchema);
