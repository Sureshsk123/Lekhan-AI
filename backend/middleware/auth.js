import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { findUserById } from '../config/db.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.warn('⚠️ JWT Validation Failed: No token provided');
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. No token provided.',
            errors: [{ field: 'authorization', message: 'No bearer token provided' }]
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'langsphere_jwt_secret_key_2026');

        let user = null;
        try {
            user = await User.findOne({ _id: decoded.id, isDeleted: false }).select('-password');
        } catch (dbErr) {
            user = null;
        }

        if (!user) {
            user = await findUserById(decoded.id);
        }

        if (!user || user.isDeleted) {
            console.warn(`⚠️ JWT Validation Failed: User with id ${decoded.id} not found or deleted`);
            return res.status(401).json({
                success: false,
                message: 'User no longer exists or authorization failed',
                errors: [{ field: 'user', message: 'User account not found' }]
            });
        }

        req.user = user.toObject ? user.toObject() : user;
        next();
    } catch (error) {
        console.warn(`⚠️ JWT Validation Failed: ${error.message}`);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token verification failed',
            errors: [{ field: 'token', message: error.message }]
        });
    }
};

export default protect;
