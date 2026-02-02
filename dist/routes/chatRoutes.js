"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const router = express_1.default.Router();
router.use(authMiddleware_1.protect); // All routes protected
router.route('/')
    .post((0, asyncHandler_1.default)(chatController_1.startChat))
    .get((0, asyncHandler_1.default)(chatController_1.getUserChats));
router.route('/:chatId/messages')
    .get((0, asyncHandler_1.default)(chatController_1.getMessages));
router.route('/messages')
    .post((0, asyncHandler_1.default)(chatController_1.sendMessage));
exports.default = router;
