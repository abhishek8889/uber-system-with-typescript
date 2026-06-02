import mongoose from 'mongoose';
import VerificationToken from '../modals/VerificationTokens';

export const createRecord = async (data : any, session : mongoose.ClientSession | null = null) => {
    const [record] = await VerificationToken.create([data], session ? { session } : {});
    return record;
};

export const findOneAndDelete = async (data : any, session : mongoose.ClientSession | null = null) => {
    const record = await VerificationToken.findOneAndDelete(data, session ? { session } : {});
    return record;
};

export const upsertToken = async (filter : any, data : any, session : mongoose.ClientSession | null = null) => {
    const record = await VerificationToken.findOneAndUpdate(
        filter,
        data,
        {   
            upsert: true,
            new: true ,
            session
        }
    );
    return record;
};



export const findOne = async (data : any) => {
    const record = await VerificationToken.findOne(data);
    return record;
};
