import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse, AppError, returnError } from '../../utils/responseHandler';
import { USER_ROLE_TYPES } from '../../constants/enums';
import * as authService from '../../services/auth/authService';

const handleError = (err: unknown, req: Request, res: Response) => {
    if (err instanceof AppError) {
        return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
    }
    return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
};

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.register(req.body);
        return sendSuccessResponse(res, req.t('success.record_created'), user, 201);
    } catch (err) {
        return handleError(err, req, res);
    }
};

export const providerRegister = async (req: Request, res: Response) => {
    try {
        const user = await authService.register({
            ...req.body,
            role: USER_ROLE_TYPES.PROVIDER,
            timezone: req.get("X-Timezone")
        });
        return sendSuccessResponse(res, req.t('success.record_created'), user, 201);
    } catch (err) {
        return handleError(err, req, res);
    }
};

export const customerRegister = async (req: Request, res: Response) => {
    try {
        const user = await authService.register({
            ...req.body,
            role: USER_ROLE_TYPES.CUSTOMER,
            timezone: req.get("X-Timezone")
        });
        return sendSuccessResponse(res, req.t('success.record_created'), user, 201);
    } catch (err) {
        return handleError(err, req, res);
    }
};

export const sendLoginOtp = async (req: Request, res: Response) => {
    try {
        const resp = await authService.sendLoginOtp(req.body);
        return sendSuccessResponse(res, req.t('success.login_otp_sent'), resp, 200);
    } catch (err) {
        return handleError(err, req, res);
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const user = await authService.verifyOtp(req.body);
        return sendSuccessResponse(res, req.t('success.otp_verified'), user, 200);
    } catch (err) {
        return handleError(err, req, res);
    }
};

export const providerProfileUpdate = async (req: Request, res: Response) => {
    try {
        const resp = await authService.providerProfileUpdate({
            ...req.body,
            user_id: req.user!._id
        });

        return sendSuccessResponse(res, req.t('success.profile_updated'), resp, 200);
    } catch (err) {
        console.log(err)
        return handleError(err, req, res);
    }
};
