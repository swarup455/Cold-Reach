import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoUrl: string | undefined = process.env.MONGO_URL;

        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined in environment variables");
        }

        const connectionInstance = await mongoose.connect(mongoUrl);
        console.log(`\n MongoDB connected !! DB host: ${connectionInstance.connection.host}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("Mongodb connection error", error.message);
        } else {
            console.log("Mongodb connection error", error);
        }
        process.exit(1);
    }
};

export default connectDB;