import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

export async function connectDB() {
  if (!MONGO_URI) throw new Error('MONGO_URI not set');

  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: false,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

export default connectDB;
