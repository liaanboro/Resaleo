"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const listingRoutes_1 = __importDefault(require("./routes/listingRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
// ... imports
// Connect to Database
(0, db_1.default)();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }
});
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
    res.send('Resaleo API Running');
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/listings', listingRoutes_1.default);
app.use('/api/chats', chatRoutes_1.default);
// Socket.io Connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });
    socket.on('send_message', (message) => {
        // Broadcast to the specific room (chatId)
        io.to(message.chatId).emit('receive_message', message);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Make io accessible to routes if needed (optional, or just use socket events)
app.set('io', io);
// Error Middleware (Must be last)
app.use(errorMiddleware_1.errorHandler);
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
