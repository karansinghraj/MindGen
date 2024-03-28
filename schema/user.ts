import mongoose, { mongo } from "mongoose";
import { Schema, Document } from "mongoose";

export interface Iuser extends Document {
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  email: string;
  password: string;
  phone: string | null;
  path: string | null;
  baseUrl: string | null;
  termsAndCondition: boolean;
  isActive: boolean;
  createdDate: Date;
  updatedDate: Date;
}

const userSchema = new Schema<Iuser>(
  {
    firstName: { type: String, maxlength: 100 }, // Set maxlength to 100 characters
    lastName: { type: String, maxlength: 100 }, // Set maxlength to 100 characters
    userName: { type: String, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    password: { type: String, required: true, maxlength: 255 },
    phone: { type: String, maxlength: 15 }, // Set maxlength to 100 characters
    path: { type: String, maxlength: 255 }, // Set maxlength to 100 characters
    baseUrl: { type: String, maxlength: 100 }, // Set maxlength to 100 characters
    termsAndCondition: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
  },
  { strict: false } // Allow other fields not specified in the schema
);

const User = mongoose.model<Iuser>("User", userSchema);

export { User };
