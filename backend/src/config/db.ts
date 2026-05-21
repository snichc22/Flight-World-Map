import mongoose from "mongoose";

const MONGO_URI: string = "mongodb://localhost:27017/SYP";

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log("DB connectDB:", `MongoDB connected -> ${conn.connection.host}`);
    } catch (error) {
        console.error("DB connectDB error:", error);
        process.exit(1);
    }
};

export default connectDB;