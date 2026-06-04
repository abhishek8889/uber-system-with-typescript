import constants from '../constants/constants';
import { SERVICE_REQUEST_STATUS } from '../constants/enums';
// import ServiceRequest from '../modals/ServiceRequest';  // TODO: Create this model
import mongoose from 'mongoose';

const { MAX_DISTANCE_RADIUS } = constants;

// Temporary placeholder until model is created
const ServiceRequest: any = null;

export const createServiceRequest = async (serviceRequestData: any, session: mongoose.ClientSession | null = null) => {
    try {
        const createdServiceRequest = await ServiceRequest.create([serviceRequestData], { session });
        return createdServiceRequest;
    } catch (error) {
        throw error;
    }
};

export const findOne = async (condition: any) => {
    try {
        const serviceRequest = await ServiceRequest.findOne(condition);
        return serviceRequest;
    } catch (error) {
        throw error;
    }
};

export const findOneAndUpdate = async (filter: any, data: any, session: mongoose.ClientSession | null = null) => {
    const record = await ServiceRequest.findOneAndUpdate(
        filter,
        data,
        {
            upsert: true,
            new: true,
            session
        }
    );

    return record;
};

export const updateOne = async (filter: any, data: any, session: mongoose.ClientSession | null = null) => {
    const record = await ServiceRequest.updateOne(
        filter,
        data,
        {
            session
        }
    );

    return record;
};

interface SearchFilter {
    longitude: number;
    latitude: number;
    service_categories?: string[];
    service_radius?: number;
}

export const searchServiceRequest = async (filter: SearchFilter) => {
    try {
        const { longitude, latitude, service_categories, service_radius } = filter;

        let geoNearQuery: any = {
            status: SERVICE_REQUEST_STATUS.PENDING
        };

        if (Array.isArray(service_categories) && service_categories.length > 0) {
            const escapedKeywords = service_categories
                .map(cat => cat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
                .join('|');

            geoNearQuery.$or = [
                { requirement: { $regex: `\\b(${escapedKeywords})`, $options: 'i' } },
                { service: { $regex: `\\b(${escapedKeywords})`, $options: 'i' } },
                { category: { $regex: `\\b(${escapedKeywords})`, $options: 'i' } },
            ];
        }

        const record = await ServiceRequest.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [Number(longitude), Number(latitude)]
                    },
                    key: "customer_location",
                    distanceField: "calculatedDistance",
                    maxDistance: service_radius ?? MAX_DISTANCE_RADIUS,
                    spherical: true,
                    query: geoNearQuery
                }
            }
        ]);

        return record;
    } catch (error) {
        throw error;
    }
};
