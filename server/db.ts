import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:admin123@cluster0.fwzpabg.mongodb.net/bookstore?retryWrites=true&w=majority';

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    console.log('[MongoDB] Connecting to Atlas cluster...');
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.error('[MongoDB] Connection error:', error?.message || error);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Warning: Connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error event:', err);
});
