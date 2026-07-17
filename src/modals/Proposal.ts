import mongoose from "mongoose";
import { generateRandomString } from "../utils/helper";
import { PROPOSAL_ENUM, USER_ROLE_TYPES } from "../constants/enums";



const ProposalSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service_requests", // Make sure this matches your ServiceRequest model name exactly
        required: [true, 'validation.request_id_required'],
        index: true // Crucial for database query performance
    },
    provider_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required :  [true, 'validation.request_id_required'],
        index: true
    },
    proposal: {
        type: String,
        required: false,
        trim: true, // Automatically removes accidental leading/trailing spaces
        maxlength: [1500, 'validation.proposal_too_long']
    },
    media: {
        type: [String], // Fixed: Converted to an array of strings to handle multiple files/images
        default: [] // Initializes as an empty array instead of null or undefined
    },
    provider_quotation: {
        type: Number,
        required: [true, 'validation.quotation_required'],
        min: [0, 'validation.quotation_cannot_be_negative'] // Safe validation guardrail
    },
    available_at: {
        type: Date,
        required: false
    },
    expected_duration: {
        type: String,
        required: false,
        maxlength: [500, 'validation.duration_character_lessthan_500']
    },
    status : {
        type : String,
        enum: [PROPOSAL_ENUM.PENDING ,PROPOSAL_ENUM.REJECTED , PROPOSAL_ENUM.ACCEPTED , PROPOSAL_ENUM.VIEWED],
        default: PROPOSAL_ENUM.PENDING
    }
}, {
    timestamps: true // Automatically adds and manages createdAt and updatedAt fields
});

// Create a compound index if providers can only send one proposal per request
ProposalSchema.index({ request_id: 1, provider_quotation: 1 });

export default mongoose.model("Proposal", ProposalSchema ,'proposals');

