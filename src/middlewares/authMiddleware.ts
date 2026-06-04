import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import envVariables from "../config/envVariables";
import { errorResponse } from "../utils/responseHandler";
import User from "../modals/User";

const authMiddleware = (...allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json(errorResponse(req.t('error.something_went_wrong')));
            }

            if (!envVariables.JWT_SECRET) {
                return res.status(500).json(errorResponse('JWT secret not configured'));
            }

            const decoded = jwt.verify(token, envVariables.JWT_SECRET) as { userId: string };
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json(errorResponse(req.t('error.user_not_found')));
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                return res.status(403).json(errorResponse(req.t('error.insufficient_role')));
            }

            req.user   = user;
            next();

        } catch (err) {
            const error = err as any;
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
            }
            return res.status(401).json({ success: false, message: 'Invalid authentication token' });
        }
    };
};

export default authMiddleware;