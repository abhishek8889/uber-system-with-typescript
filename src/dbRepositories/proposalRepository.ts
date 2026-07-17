import mongoose  from "mongoose";
import Proposal from "../modals/Proposal";

export const create = async (data:object ,session: mongoose.ClientSession) => {
    try{
        const [proposal] = await Proposal.create([data], session ? { session } : {});
        return proposal;
    }catch(error){
        throw error;
    }
}

export const findOne = async (data:object) => {
    try{
        const record = await Proposal.findOne(data);
        return record;
    } catch(error) {
        throw error;
    }
};
