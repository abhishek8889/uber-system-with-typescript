import { returnError } from "../../utils/responseHandler";
import moment from "moment";
import momentTz from "moment-timezone";
import * as mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import * as userRepository from '../../dbRepositories/userRepository';
import * as verificationTokensRepository from '../../dbRepositories/verificationTokensRepository';
import * as providerProfileRepository from '../../dbRepositories/providerProfileRepository';

import * as twilioService from "../../services/twilio/twilio";
import { generateRandomString } from "../../utils/helper";
import { STATUS, VERIFICATION_TOKEN_TYPE } from "../../constants/enums";
import { translate } from  "../../utils/translator";
import envVariables from "../../config/envVariables";


//  ############## Register Service ############

interface RegisterData {
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
    timezone: string;
    lang?: string;
}

export const register = async (reqData: RegisterData) => {

    const { first_name, last_name, phone, role, timezone } = reqData;

    if (!momentTz.tz.zone(timezone)) {
        returnError("error.invalid_timezone", 400);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingUser = await userRepository.findUserByPhone(phone);

        if (existingUser) returnError("error.user_already_exists", 409);

        const user = await userRepository.createUser({ first_name, last_name, phone, role, timezone }, session);

        if (!user) returnError("error.error_in_creating_user", 500);

        const otp = generateRandomString(6).toUpperCase();

        await verificationTokensRepository.createRecord({
            user_id: user!._id,
            type: VERIFICATION_TOKEN_TYPE.REGISTER,
            token: otp,
            expired_at: moment.utc().add(10, 'minutes').toDate(),
        }, session);

        const otpBody = `Your OTP is ${otp}`;

        const sendOtp = await twilioService.sendMessageFromTwilio({ to: phone, body: otpBody });
        if (!sendOtp) returnError("error.error_in_sending_verification_otp", 400);

        await session.commitTransaction();
        return user;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

// ############## SEND LOGIN OTP ############ 

interface LoginRequestData {
    phone : string,
    role : string
}

export const sendLoginOtp = async (reqData : LoginRequestData) => {
    const { phone, role } = reqData;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await userRepository.findUserByPhone(phone);

        if(!user || user.role !== role) returnError("error.user_not_found", 404);
        
        const otp = generateRandomString(6).toUpperCase();

        await verificationTokensRepository.upsertToken(
            {
                user_id: user!.id ,
                type: VERIFICATION_TOKEN_TYPE.LOGIN
            } ,
            {
                token: otp,
                expired_at: moment.utc().add(10, 'minutes').toDate()
            }, session);

        const otpBody = translate('message.login_verify_otp', { first_name: user!.first_name, otp });

        const sendOtp = await twilioService.sendMessageFromTwilio({ to: phone, body: otpBody });
        
        if(!sendOtp) returnError("error.error_in_sending_verification_otp", 400);

        await session.commitTransaction();
        return user;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};



// ############### VERIFY OTP ###################  

interface VerifyOtpRequest {
    user_id : string ;
    otp : string ;
    type : string ;
}

export const verifyOtp = async (reqData : VerifyOtpRequest) => {
    const { user_id , otp , type } = reqData;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const verification = await verificationTokensRepository.findOneAndDelete({
            user_id : user_id,
            type : type,
            token : otp ,
            expired_at: { $gt: moment.utc().toDate() }
        }, session);

        if(!verification) returnError('error.invalid_or_expired_verification_token' ,400);
        
        const updateInUser = {
            otp_verfication : true ,
            status : STATUS.ACTIVE ,
        };

        const user = await userRepository.findByIdAndUpdate(user_id , updateInUser , session);

        if (!user) returnError('error.user_not_found', 404);

        if (!envVariables.JWT_SECRET) returnError('JWT secret not configured', 500);

        const token = jwt.sign(
            {
                userId: user!._id,
                phone: user!.phone,
                role: user!.role,
                username: user!.username,
                timezone: user!.timezone,
                locale: user!.locale
            },
            envVariables.JWT_SECRET as string
        );
        
        const otpBody = translate('message.otp_verified_successfully');

        const sendOtp = await twilioService.sendMessageFromTwilio({to : user!.phone, body:otpBody});

        if (!sendOtp) returnError('error.error_in_sending_verification_otp', 400); 
        
        await session.commitTransaction();

        return {
            token : token ,
            user : user
        };

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};



//  ############## Provider Profile Update #############

interface ProviderProfileUpdateRequest {
    first_name? : string;
    last_name? : string;
    profile_image? : string;
    location_name? : string;
    latitude? : number;
    longitude? : number;
    service_radius? : number;
    is_online? : boolean;
    is_available? : boolean;
    service_categories? : string[];
    user_id : string;
}

export const providerProfileUpdate = async (reqData: ProviderProfileUpdateRequest) => {
  
    const { 
        first_name ,
        last_name ,
        profile_image ,
        location_name ,
        latitude ,
        longitude  ,
        service_radius  ,
        is_online  ,
        is_available  ,
        service_categories ,
        user_id
    } = reqData;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const updateInUser = Object.fromEntries(
            Object.entries(reqData).filter(
                ([key ,value]) => 
                    value !== undefined &&
                    value !== null &&
                    key !== 'user_id'
            )
        );

        if (updateInUser.latitude && updateInUser.longitude) {
            updateInUser.location = {
                type: "Point",
                coordinates: [
                    Number(updateInUser.longitude),
                    Number(updateInUser.latitude)
                ]
            };

            delete updateInUser.latitude;
            delete updateInUser.longitude;
        }

        if (updateInUser.service_radius) {
            updateInUser.service_radius = Number(updateInUser.service_radius);
        }
        
        const user = await userRepository.findByIdAndUpdate(user_id , updateInUser , session);

        const providerProfileData = await providerProfileRepository.upsertProviderProfile({ user_id: user_id }, updateInUser , session);

        await session.commitTransaction();
        
        return user;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};