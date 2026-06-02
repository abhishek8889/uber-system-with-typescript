import mongoose from 'mongoose';
import envVariables from './envVariables';

const connectDB = async () => {
  if (!envVariables.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  try {
    await mongoose.connect(envVariables.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;