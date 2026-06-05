import { v2 as cloudinary } from 'cloudinary';
import envVariables from '../../config/envVariables';

cloudinary.config({
    cloud_name: envVariables.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: envVariables.CLOUDINARY_API_KEY ?? '',
    api_secret: envVariables.CLOUDINARY_API_SECRET ?? ''
});

export const uploadImage = async (image: string, public_id: string) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(image, { public_id });
        return uploadResult;
    } catch (error) {
        throw error;
    }
};
