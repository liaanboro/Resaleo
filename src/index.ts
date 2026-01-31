import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import listingRoutes from './routes/listingRoutes';
import chatRoutes from './routes/chatRoutes';

import http from 'http';
import { Server } from 'socket.io';

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


app.get('/', (req, res) => {
  res.send('Resaleo API Running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chats', chatRoutes);

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
app.use(errorHandler);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
