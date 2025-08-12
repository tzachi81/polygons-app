import { MongoClient } from 'mongodb';

import * as dotenv from 'dotenv';

dotenv.config();

const dbUri = process.env.MONGODB_POLYGONS_URI!;
const client = new MongoClient(dbUri);
const dbName = 'polygonsDB';

const collectionName = 'polygons';

export const closeDBConnection = async () => {
  try {
    await client.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}
export const connectDB = async () => {
  await client.connect();
  console.log('Connected successfully to MongoDB');
  return client.db(dbName).collection(collectionName);
};