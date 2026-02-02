"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// Instead of express-async-handler, we can wrap routes or use a simple try-catch in controller. 
// For cleaner code, I recommend creating a wrapper or using a library. 
// However, since I used throw Error in controllers, I need to wrap them to catch async errors.
// Currently standard Express 4.x doesn't handle async errors automatically (Express 5 does).
// I will implement a quick asyncHandler utility inline or separate.
// Let's assume we use a simple inline wrapper for now, or use express-async-handler if installed.
// I didn't install `express-async-handler`. I'll create a `middleware/asyncHandler.ts`.
const router = express_1.default.Router();
router.post('/register', (0, asyncHandler_1.default)(authController_1.registerUser));
router.post('/login', (0, asyncHandler_1.default)(authController_1.loginUser));
router.post('/logout', authController_1.logoutUser);
router.get('/profile', authMiddleware_1.protect, (0, asyncHandler_1.default)(authController_1.getUserProfile));
exports.default = router;
