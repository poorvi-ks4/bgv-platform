import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const get = (key, fallback) => {
  const val = process.env[key];
  if (val === undefined) return fallback;
  return val;
};

export const PORT = Number(get('PORT', 5000));
export const MONGO_URI = get('MONGO_URI');
export const FIREBASE_PROJECT_ID = get('FIREBASE_PROJECT_ID');
export const GOOGLE_APPLICATION_CREDENTIALS = get('GOOGLE_APPLICATION_CREDENTIALS');
export const FIREBASE_SERVICE_ACCOUNT_B64 = get('FIREBASE_SERVICE_ACCOUNT_B64');

if (!MONGO_URI) {
  console.warn('Warning: MONGO_URI is not set. Database connection will fail.');
}

export default {
  PORT,
  MONGO_URI,
  FIREBASE_PROJECT_ID,
  GOOGLE_APPLICATION_CREDENTIALS,
  FIREBASE_SERVICE_ACCOUNT_B64,
};
