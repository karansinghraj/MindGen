import mongoose from "mongoose";

const Url = "mongodb://127.0.0.1:27017/MindGen";

const db = async () => {
  try {
    await mongoose.connect(Url);
    console.log("Successfully connected to mongoDB");
  } catch (error) {
    console.log("MongoDB connection Error", error);
  }
};

export { db };
