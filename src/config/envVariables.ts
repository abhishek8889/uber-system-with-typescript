require('dotenv').config();

const envVariables = {
    PORT : process.env.PORT,
    APP_NAME : process.env.APP_NAME,
    TWILIO_ACCOUNT_SID : process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN : process.env.TWILIO_AUTH_TOKEN ,
    MONGODB_URI : process.env.MONGODB_URI,
    TWILIO_PHONE_NUMBER : process.env.TWILIO_PHONE_NUMBER,
    JWT_SECRET : process.env.JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    OPENAI_API_KEY : process.env.OPENAI_API_KEY
}

export default envVariables;