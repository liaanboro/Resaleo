
import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const email = 'admin@olx.com';
        const name = 'omajanw'; // As requested by user logic
        const password = 'password123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            user.name = name; // Ensure name matches the specific check if any
            user.password = hashedPassword;
            await user.save();
            console.log('Admin user updated:', user);
        } else {
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin',
                phone: '9999999999'
            });
            console.log('Admin user created:', user);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
