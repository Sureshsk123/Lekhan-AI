import mongoose from 'mongoose';
import { seedDatabase } from './seedData.js';

export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    if (mongoose.connection.readyState === 2) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (mongoose.connection.readyState === 1) return mongoose.connection;
    }

    const mongoUri = process.env.MONGODB_URI;
    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`✅ Database Connected: ${conn.connection.host}`);
        await seedDatabase();
        return conn;
    } catch (error) {
        console.error(`❌ Database Error: ${error.message}`);

        if (process.env.NODE_ENV !== 'production') {
            try {
                console.log('🔄 Initializing MongoMemoryServer development fallback...');
                const { MongoMemoryServer } = await import('mongodb-memory-server');
                const mongoServer = await MongoMemoryServer.create();
                const fallbackUri = mongoServer.getUri();
                const conn = await mongoose.connect(fallbackUri);
                console.log(`✅ Database Connected (In-Memory MongoDB Instance): ${conn.connection.host}`);
                await seedDatabase();
                return conn;
            } catch (fallbackErr) {
                console.error(`❌ Fallback Database Error: ${fallbackErr.message}`);
                process.exit(1);
            }
        }

        process.exit(1);
    }
};

export default connectDB;
