import express from 'express';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import listingRoutes from './routes/listingRoutes';
import chatRoutes from './routes/chatRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message';

// ... imports

// Connect to Database
connectDB();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.get('/', (req, res) => {
  res.send('Resaleo API Running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_user', (userId: string) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined user room ${userId}`);
  });

  socket.on('join_chat', (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('send_message', (payload: any) => {
    // Payload expects { message: MessageObject, receiverId: string }
    const { message, receiverId } = payload;

    // Broadcast to the specific chat room for real-time chat UI
    if (message && message.chatId) {
      // Handle if message.chatId is object or string
      const chatId = typeof message.chatId === 'object' ? message.chatId._id : message.chatId;
      io.to(chatId).emit('receive_message', message);
    }

    // Send notification to receiver
    if (receiverId) {
      io.to(receiverId).emit('receive_notification', {
        type: 'message',
        message
      });
    }
  });

  socket.on('mark_as_read', async (payload: { chatId: string, userId: string }) => {
    const { chatId, userId } = payload;

    // Update all messages in this chat that were NOT sent by this user, adding them to readBy
    if (chatId && userId) {
      await Message.updateMany(
        { chatId, senderId: { $ne: userId }, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );

      // Broadcast to the chat room that messages have been read
      io.to(chatId).emit('messages_read', { chatId, readerId: userId });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes if needed (optional, or just use socket events)
app.set('io', io);

// Error Middleware (Must be last)
app.use(errorHandler);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
