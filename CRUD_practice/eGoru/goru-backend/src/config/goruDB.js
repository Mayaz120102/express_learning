import mongoose from "mongoose";

const connectGoruDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🐄 ✅ Goru DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`db connection failed: ${error.message}`);

    process.exit(1);
  }
};

export default connectGoruDB;
