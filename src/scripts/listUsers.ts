
import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const users = await User.find({}, 'name email role');
        console.log('Users found:', users);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listUsers();
