import mongoose from "mongoose";
import Logger from '@/Logger';

export const connectToMongo = async () => {
    try {
        if (!process.env.MONGODB_URI) throw new Error("MONGO_URI manquant");
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DBNAME,
            user: process.env.MONGODB_USERNAME,
            pass: process.env.MONGODB_PASSWORD
        });
        Logger.info('Link to mongodb etablished');

    } catch (error) {
        Logger.error('Fail to connection mongodb', error);
        process.exit(1);
    }
};