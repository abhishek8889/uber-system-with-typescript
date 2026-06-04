import { Request, Response } from 'express';
import { sendSuccessResponse, sendErrorResponse, AppError, returnError } from '../../utils/responseHandler';
import  * as mainService from "../../services/main/mainService";

const handleError = (err: unknown, req: Request, res: Response) => {
    if (err instanceof AppError) {
        return sendErrorResponse(res, req.t(err.message), null, err.statusCode);
    }
    return sendErrorResponse(res, req.t('error.something_went_wrong'), null, 500);
};

export const searchProvider = async (req: Request, res: Response) => {
    try {
        const resp = await mainService.searchProvider({...req.body , customer_id : req.user!._id});
        
        return sendSuccessResponse(res, req.t('success.record_found'), resp , 200);
    } catch (err) {
        return handleError(err, req, res);
    }
};

// exports.uploadImage = async(req , res) => {
//     try{
//         const image = req.files?.image  ?? null;
        
//         const resp = await mainService.uploadImage(image);

//         return res.status(200).json(successResponse(req.t('success.image_uploaded_successfully'), resp));
//     } catch (error) {
//         const status = error.statusCode || 500;
//         const message = error.statusCode
//             ? req.t(error.message)
//             : req.t('error.something_went_wrong');

//         return res.status(status).json(errorResponse(message, req.t(error.message)));
//     }
// }


// exports.cancelServiceRequest = async ( req , res) => {
//     try{
//         const resp = await mainService.cancelServiceRequest({...req.body ,user_id : req.user._id});

//         return res.status(200).json(successResponse(req.t('success.req_canceled_successfully'), resp));
//     } catch (error) {
//         const status = error.statusCode || 500;
//         const message = error.statusCode
//             ? req.t(error.message)
//             : req.t('error.something_went_wrong');

//         return res.status(status).json(errorResponse(message, req.t(error.message)));
//     } 
// }

// // ############ Notification List ###################


// exports.serviceNotificationList = async (req ,res) => {
//     try{
//         const resp = await mainService.serviceNotificationList({...req.body ,user_id : req.user._id});

//         return res.status(200).json(successResponse(req.t('success.request_updated'), resp));
//     } catch (error) {
//         const status = error.statusCode || 500;
//         const message = error.statusCode
//             ? req.t(error.message)
//             : req.t('error.something_went_wrong');

//         return res.status(status).json(errorResponse(message, req.t(error.message)));
//     } 
// } 


// // ################## SERVICE REQUEST LIST ################

// exports.serviceRequestList = async (req ,res) => {
//     try{
//         const resp = await mainService.serviceRequestList({...req.body ,user_id : req.user._id});

//         return res.status(200).json(successResponse(req.t('success.service_request_list'), resp));
//     } catch (error) {
//         const status = error.statusCode || 500;
//         const message = error.statusCode
//             ? req.t(error.message)
//             : req.t('error.something_went_wrong');

//         return res.status(status).json(errorResponse(message, req.t(error.message)));
//     } 
// } 

// //  ############ PROVIDER REQUEST RESPONSE #############

// exports.providerRequestResponse = async (req , res) => {
//     try{
//         const resp = await mainService.providerRequestResponse({...req.body ,user_id : req.user._id});

//         return res.status(200).json(successResponse(req.t('success.request_updated'), resp));
//     } catch (error) {
//         const status = error.statusCode || 500;
//         const message = error.statusCode
//             ? req.t(error.message)
//             : req.t('error.something_went_wrong');

//         return res.status(status).json(errorResponse(message, req.t(error.message)));
//     } 
// }

// //  ############### SEND PROPOSAL ############

// exports.sendProposal = async (req, res) => {
//     try{
//         // const validatedPayload = matchedData(req, { includeOptionals: true });
//         // console.log(validatedPayload)
//         const resp = await mainService.sendProposal({...req.body ,user_id : req.user._id});

//         return res.status(200).json(successResponse(req.t('success.proposal_sent_successfully'), resp));
//     } catch (error) {
//         const status = error.statusCode || 500;
//         const message = error.statusCode
//             ? req.t(error.message)
//             : req.t('error.something_went_wrong');

//         return res.status(status).json(errorResponse(message, req.t(error.message)));
//     } 
// }