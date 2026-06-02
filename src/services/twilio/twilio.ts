import envVariables from '../../config/envVariables';
import twilio from 'twilio';
import { returnError } from '../../utils/responseHandler';

const client = twilio(
  envVariables.TWILIO_ACCOUNT_SID,
  envVariables.TWILIO_AUTH_TOKEN
);

interface SendMessageParam {
    to: string;
    body: string;
}

export const sendMessageFromTwilio = async ({ to, body }: SendMessageParam) => {
    try {
        if (!to) returnError("error.phone_number_required", 400);

        if (!envVariables.TWILIO_PHONE_NUMBER) returnError("Twilio phone number not configured", 500);

        const message = await client.messages.create({
            body: body || `Hello from ${envVariables.APP_NAME}`,
            from: envVariables.TWILIO_PHONE_NUMBER as string,
            to
        });

        return message;
    } catch (error) {
        throw error;
    }
}
