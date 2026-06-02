import { Request, Response } from 'express';
import { returnError, sendSuccessResponse, sendErrorResponse, AppError } from '../../utils/responseHandler';

import { VERIFICATION_TOKEN_TYPE, USER_ROLE_TYPES } from '../../constants/enums';
import * as authService from '../../services/auth/authService';



export const register = async (req: Request, res : Response) => {
    try {
        const user = await authService.register(req.body);

        return sendSuccessResponse(res, req.t('success.record_created'), user, 201);
    } catch (err) {
        if (err instanceof AppError) {
            return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
        }
        return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
    }
};


export const providerRegister = async (req: Request, res : Response) => {
    try {
        console.log('hello')
        const user = await authService.register({
            ...req.body,
            role: USER_ROLE_TYPES.PROVIDER,
            timezone: req.get("X-Timezone")
        });

        return sendSuccessResponse(res, req.t('success.record_created'), user, 201);
    } catch (err) {
        if (err instanceof AppError) {
            return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
        }
        return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
    }
};




//  ####### Provider Login ############

export const sendLoginOtp = async(req : Request, res : Response) => {
    try {
        const resp = await authService.sendLoginOtp(req.body);

        return sendSuccessResponse(res, req.t('success.login_otp_sent'), resp, 201);
    } catch (err) {
        if (err instanceof AppError) {
            return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
        }
        return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
    }
}


export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const user = await authService.verifyOtp(req.body);
        return sendSuccessResponse(res, req.t('success.otp_verified'), user, 200);
    } catch (err) {
        if (err instanceof AppError) {
            return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
        }
        return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
    }
};

//  ############## CUSTOMER SIGNUP #############

export const customerRegister = async (req : Request, res : Response) => {
    try {
        const user = await authService.register({
            ...req.body,
            role: USER_ROLE_TYPES.CUSTOMER,
            timezone: req.get("X-Timezone")
        });

        return sendSuccessResponse(res, req.t('success.record_created'), user, 201);
    } catch (err) {
        if (err instanceof AppError) {
            return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
        }
        return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
    }
}

//  ########### Provider Profile Update ############

export const providerProfileUpdate = async (req: Request, res: Response) => {
    try {
        const resp = await authService.providerProfileUpdate({
            ...req.body,
            user_id : req.user!._id
        });

        return sendSuccessResponse(res, req.t('success.record_created'), resp, 200);
    } catch (err) {
       if (err instanceof AppError) {
            return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
        }
        return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
    }
};


