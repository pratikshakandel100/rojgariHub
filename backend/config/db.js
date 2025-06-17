import mongoose from 'mongoose';
const MONGO_URL = "mongodb://127.0.0.1:27017/RojgariHub";
const connectDB = async () => {
  try {
    await mongoose.connect(process.MONGO_URL);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;