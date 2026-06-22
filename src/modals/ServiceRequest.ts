// const mongoose = require('mongoose');
// const { SERVICE_REQUEST_STATUS } = require('../constants/enums');

import mongoose from 'mongoose';
import { SERVICE_REQUEST_STATUS, SERVICE_TYPE } from '../constants/enums';

const ServiceRequestSchema = new mongoose.Schema (
    {
        provider_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        customer_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        } ,
        location_name : {
            type : String,
            required : true
        },
        customer_location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true
            },
            coordinates: {
                type: [Number],   // [longitude, latitude]
                required: true,
                validate: {
                validator: function (value : number[]) {
                    return value.length === 2;
                },
                message: "Coordinates must have [longitude, latitude]"
                }
            }
        },
        requirement: {
            type: String,
            default: ""
        } ,
        service: {
            type: String,
            default: ""
        } ,
        service_type: {
            type: String,
            enum: Object.values(SERVICE_TYPE),
            default: SERVICE_TYPE.ONLINE
        } ,
        customer_quotation : { // Price set by Customer
            type: Number,
            default: 0
        },
        provider_quotation : { // Price set by Provider
            type: Number,
            default: 0
        } , 
        category : {
            type : Array,
            default : []
        },
        status: {
            type: String,
            enum: Object.values(SERVICE_REQUEST_STATUS),
            default: SERVICE_REQUEST_STATUS.PENDING
        } ,
        status_updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    },
    {timestamps: true }
);

ServiceRequestSchema.index({
    customer_location: "2dsphere"
});

export default mongoose.model("ServiceRequest", ServiceRequestSchema, 'service_requests');
