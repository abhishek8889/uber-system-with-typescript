// const User = require('../modals/User');
// const ProviderProfile = require('../modals/ProviderProfile')

import mongoose from 'mongoose';
import User from '../modals/User';


export const createUser = async (data : any, session : mongoose.ClientSession | null = null) => {
    const [user] = await User.create([data], session ? { session } : {});
    return user;
};

export const findUserByPhone = async (phone : string) => {
    return await User.findOne({ phone });
};

export const findUserById = async (id : string) => {
    return await User.findById(id);
};


export const findByIdAndUpdate = async (id : string, data : any, session : mongoose.ClientSession | null = null) => {
    const user = await User.findByIdAndUpdate(
        id,
        data,
        { 
            new: true ,
            session
        }
    );
    return user;
};


export const userDetailsById = async (id : string, role : string) => {
    try{
        let matchData : any = {
            _id : id
        }

        if(role != null) {
            matchData = {...matchData , role}
        }

        const result  = await User.aggregate([
            {
                $match : matchData
            },
            {
                $lookup : {
                    from : "provider_profiles",
                    localField : "_id" ,
                    foreignField : "user_id" ,
                    as : "provider_profile"
                }
            },
            {
                $unwind: {
                    path: "$provider_profile",
                    preserveNullAndEmptyArrays: true
                }
            } ,
            {
                $project : {
                    _id : 1 ,
                    first_name : 1 ,
                    last_name : 1 ,
                    role : 1 ,
                    "provider_profile.user_id" : 1 , 
                    "provider_profile.location" : 1 , 
                    "provider_profile.service_categories" : 1 , 
                    "provider_profile.service_radius" : 1 
                }
            }
        ]);

        return result;
    }catch(error) {
        throw error;
    }
}
