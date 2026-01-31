import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Or use IUser interface if avail
      files?: any; // For multer
    }
  }
}
