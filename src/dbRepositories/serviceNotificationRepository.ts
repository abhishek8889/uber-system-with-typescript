import ServiceNotification from '../modals/ServiceNotification';
import mongoose from 'mongoose';

export const insertMany = async (reqData: any[], session: mongoose.ClientSession | null = null) => {
    try {
        const notification = await ServiceNotification.insertMany(reqData, { session });
        return notification;
    } catch (error) {
        throw error;
    }
};
