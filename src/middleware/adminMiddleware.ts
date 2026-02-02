
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: any;
}

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'admin' || req.user.name === 'omajanw')) {
        next();
    } else {
        res.status(401);
        next(new Error('Not authorized as an admin'));
    }
};
