import mongoose, { Date, mongo } from "mongoose";
import { Schema, Document } from "mongoose";

export interface Iotp extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  otp: string | null;
  updatedDate: Date;
}

const otpSchema = new mongoose.Schema<Iotp>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  updatedDate: { type: Date, default: Date.now },
});

// Create a TTL index on the updatedDate field
otpSchema.index({ updatedDate: 1 }, { expireAfterSeconds: 120 }); // Expires after 60 seconds

// Middleware to update the 'updatedDate' field before saving the document
// userOtpSchema.pre<Iotp>("save", function (next) {
//     this.updatedDate = new Date();
//     next();
//   });

const Otp = mongoose.model<Iotp>("Otp", otpSchema);

export { Otp };
