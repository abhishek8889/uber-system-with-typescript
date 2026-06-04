import mongoose from 'mongoose';

const serviceNotificationSchema = new mongoose.Schema(
    {
        service_request_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceRequest",
            required: true
        },
        provider_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        customer_quotation: {
            type: Number,
            default: 0
        },
        provider_quotation: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "completed"],
            default: "pending"
        },
        is_seen: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("ServiceNotification", serviceNotificationSchema, 'service_notifications');
