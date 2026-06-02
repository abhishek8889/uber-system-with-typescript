import * as mongoose from 'mongoose';
import { VERIFICATION_TOKEN_TYPE } from '../constants/enums';


const verificationTokens = new mongoose.Schema (
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        type : {
            type : String,
            enum: Object.values(VERIFICATION_TOKEN_TYPE),
            default: VERIFICATION_TOKEN_TYPE.REGISTER
        },
        token : {
            type : String,
            required : true
        },
        expired_at : {
            type : Date,
            required : true
        }
    },
    { timestamps: true }
);


export default mongoose.model('VerificationToken', verificationTokens);