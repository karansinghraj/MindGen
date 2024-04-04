"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    otp: { type: String, required: true },
    updatedDate: { type: Date, default: Date.now },
});
// Create a TTL index on the updatedDate field
otpSchema.index({ updatedDate: 1 }, { expireAfterSeconds: 60 }); // Expires after 60 seconds
// Middleware to update the 'updatedDate' field before saving the document
// userOtpSchema.pre<Iotp>("save", function (next) {
//     this.updatedDate = new Date();
//     next();
//   });
const Otp = mongoose_1.default.model("Otp", otpSchema);
exports.Otp = Otp;
