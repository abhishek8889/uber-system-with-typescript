import { Document } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user?: Document & {
                _id: any;
                first_name: string;
                last_name: string;
                phone: string;
                role: string;
                timezone: string;
                locale: string;
                username: string;
                status: string;
            };
        }
    }
}
