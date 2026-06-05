import mongoose from "mongoose";
import moment from "moment";
import momentTz from "moment-timezone";
import { promises as fs } from 'fs';

import * as providerProfileRepository from "../../dbRepositories/providerProfileRepository";
import constants from "../../constants/constants";

import ProviderProfile from "../../modals/ProviderProfile";
import User from "../../modals/User";

import * as serviceRequestRepository from "../../dbRepositories/serviceRequestRepository";

import * as serviceNotificationRepository from "../../dbRepositories/serviceNotificationRepository";
import * as userRepository from "../../dbRepositories/userRepository";
// import * as proposalRepository from "../../dbRepositories/proposalRepository";

import * as cloudinaryService from "../cloudinary/cloudinaryService";

import {
    SERVICE_REQUEST_STATUS,
    USER_ROLE_TYPES,
    PROPOSAL_ENUM
} from "../../constants/enums";

import { returnError } from "../../utils/responseHandler";
import {translate} from "../../utils/translator";


interface SearchProviderReq {
    location_name : string;
    latitude : number;
    longitude : number; 
    service : string; 
    requirement : string;
    category : string[];
    customer_quotation : string;
    customer_id : string
}

export const searchProvider = async (reqData : SearchProviderReq) => {
    const {
        location_name ,
        latitude ,
        longitude ,
        service ,
        requirement ,
        category ,
        customer_quotation ,
        customer_id
    } = reqData;

    try{
        // ######### Check already pending request ################

        const pendingRequest = await serviceRequestRepository.findOne({
            customer_id: customer_id,
            status : SERVICE_REQUEST_STATUS.PENDING
        });

        if(pendingRequest){
            returnError("error.you_have_already_a_pending_request" , 400);
        }

        //  ############## Send Notification to the searched providers ##############
        const saveServiceRequest = await serviceRequestRepository.createServiceRequest({
            customer_id : customer_id ,
            location_name : location_name,
            customer_location : {
                type : "Point" ,
                coordinates : [longitude , latitude]
            },
            requirement : requirement ,
            service : service ,
            category : category,
            customer_quotation : reqData.customer_quotation
        } , null);

        return saveServiceRequest;
    } catch (error) {
        throw error;
    }
};


export const uploadImage= async (image:any ,uploadArea: string = 'cloudinary')  => {
    try{
        const uploadArea =  constants.FILE_UPLOAD_AREA ;
        
        const fileName = `${Date.now()}`;

        const filePath = `${uploadArea}/${fileName}`;

        const imageResult = await cloudinaryService.uploadImage(image.tempFilePath , fileName);
        
        //  Delete File from temp folder after upload to cloudinary
        fs.unlink(image.tempFilePath);

        return {
            'secure_url' : imageResult?.secure_url ?? null ,
            'public_id' : imageResult?.public_id ?? null ,
            'formats' : imageResult?.format ?? null
        };
    } catch (error) {
        throw error;
    }
}


//  ############## Post Service Request ##############
interface SearchProviderReq{

}
export const postServiceRequest = async(reqData : SearchProviderReq) => {
    try{
        return "Post Service Request";
    }catch(err){
        throw err;
    }
}


// #############  BACKGROUND PROCESS  ###############        
// process.nextTick(async () => {
//     try {
//         //  ########## Search Providers ###############
//         const providers = await providerProfileRepository
//             .searchProvidersForCustomer(
//                 latitude,
//                 longitude,
//                 service,
//                 requirement,
//                 category
//             );

//         if ( !providers || providers.length === 0 ) {
//             return;
//         }

//         // ########## Prepare Notifications ###############

//         const notifications = providers.map(provider => ({
//             service_request_id: saveServiceRequest[0]._id,
//             provider_id: provider.user_id,
//             customer_id : customer_id,
//             customer_quotation : customer_quotation,
//             status: SERVICE_REQUEST_STATUS.PENDING,
//             is_seen: false
//         }));

//         // ############ BULK INSERT NOTIFICATIONS ##############
//         const notificationRecord = await serviceNotificationRepository.insertMany(notifications);
//     } catch (error) {
//         // console.error("Background Provider Search Error:",error);
//     }
// });

// exports.cancelServiceRequest = async (reqData) => {
    
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try{
//         const {user_id} = reqData;

//         const pendingReqExist = await serviceRequestRepository.findOne({
//             $or : [
//                 {customer_id : user_id},
//                 {provider_id : user_id}
//             ] ,
//             status : SERVICE_REQUEST_STATUS.PENDING
//         });

//         if(!pendingReqExist){
//             returnError("error.there_is_no_pending_req_to_cancel" ,400);
//         }

//         const serviceRequest = await serviceRequestRepository.updateOne(
//             {
//                 $or : [
//                     {customer_id : user_id},
//                     {provider_id : user_id}
//                 ] ,
//                 status : SERVICE_REQUEST_STATUS.PENDING
//             } , 
//             {
//                 status : SERVICE_REQUEST_STATUS.REJECTED
//             } , session);

//         await session.commitTransaction();

//         return serviceRequest;
//     }catch (error) {
//         await session.abortTransaction();
//         throw error;
//     }finally {
//         session.endSession();
//     }
// }

// // exports.acceptServiceRequest = async (providerId , customerId , customerLocation , requirement , service) => {

// // };

// exports.providerRequestResponse = async (reqData) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try{
//         return "Prvoider request response";


//         await session.commitTransaction();
//         // return serviceRequest;
//     }catch (error) {
//         await session.abortTransaction();
//         throw error;
//     }finally {
//         session.endSession();
//     }
// }

// // ############# Service Request List ##############

// exports.serviceRequestList = async (reqData) => {
//     try{
//         const {user_id} = reqData;
//         const [providerDetails] = await userRepository.userDetailsById(user_id );

//         if(!providerDetails.provider_profile || providerDetails.provider_profile == undefined){
//             returnError("error.complete_profile_before_finding_jobs",400);
//         }

//         // ######### Find Jobs ##########

//         const searchFilter = {
//             longitude : providerDetails?.provider_profile?.location?.coordinates[0],
//             latitude : providerDetails?.provider_profile?.location?.coordinates[1],
//             service_categories : providerDetails?.provider_profile?.service_categories ?? [],
//             service_radius : providerDetails?.provider_profile?.service_radius ?? constants.MAX_DISTANCE_RADIUS
//         }
 
//         const [requestedServicesList] = await serviceRequestRepository.searchServiceRequest(searchFilter);
        
//         return requestedServicesList;
//     }catch (error) {
//         throw error;
//     }
// }

// //  ################### PROPOSAL SEND  ##############

// exports.sendProposal = async(reqData) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try{
//         const {request_id , proposal , media , provider_quotation , available_at , expected_duration } = reqData;
  
//         //  ########## Allow Proposal only when Request is pending ##########

//         const requestDetail = await serviceRequestRepository.findOne({_id : request_id});

//         // console.log(requestDetail)

//         if(requestDetail.status !== SERVICE_REQUEST_STATUS.PENDING) {
//             return returnError(translator.translate('error.you_cannot_send_proposal_because_status_is_already', { status: requestDetail.status ?? "rejected" }) ,400);
//         }

//         return requestDetail;

//         const existingProposal = await proposalRipository.findOne({
//             request_id : request_id ,
//             provider_id : user_id 
//         });

//         if(existingProposal) {
//             returnError("error.your_proposal_already_pending")
//         }

//         const proposalResp  = await proposalRipository.create({
//             request_id : request_id ,
//             proposal : proposal ,
//             media : media ,
//             provider_quotation : provider_quotation ,
//             available_at : available_at ,
//             expected_duration : expected_duration
//         } , session);

//         await session.commitTransaction();
//         return proposalResp;
//     } catch (error) {
//         await session.abortTransaction();
//         throw error;
//     } finally {
//         session.endSession();   
//     }
// }


