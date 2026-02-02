"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    participants: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
    listingId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
// Compound index to ensure unique chat per listing per pair (optional but good)
chatSchema.index({ listingId: 1, participants: 1 });
exports.default = mongoose_1.default.model('Chat', chatSchema);
