import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoclustername = process.env.mongoclustername;
const mongopass = process.env.mongopass;

const Url = `mongodb+srv://mindgen:${mongoclustername}@cluster0.${mongopass}.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const Url = "mongodb://127.0.0.1:27017/MindGen";

const db = async () => {
  try {
    await mongoose.connect(Url);
    console.log("Successfully connected to mongoDB");
  } catch (error) {
    console.log("MongoDB connection Error", error);
  }
};

export { db };
