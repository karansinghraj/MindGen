"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpverification = exports.userLogin = exports.userSignUp = void 0;
const user_1 = require("../schema/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//const JWT = require("jsonwebtoken");
const nodemailer_1 = __importDefault(require("nodemailer"));
const otp_1 = require("../schema/otp");
//const nodemailer =  require("nodemailer")
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not provided");
}
const SecretKey = process.env.JWT_SECRET_KEY;
function encryptPassword(passsword) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRound = 10; // No of time it gone Hash
        const hashPassword = yield bcrypt_1.default.hash(passsword, saltRound);
        return hashPassword;
    });
}
function sendMail(subject, message, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                tls: {
                    ciphers: "SSLv3",
                    rejectUnauthorized: false,
                    // ciphers: 'TLS_AES_256_GCM_SHA384', // Use modern TLS cipher suite
                    // rejectUnauthorized: true // Validate server certificate
                },
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: subject,
                text: message,
                html: message,
            };
            const mailInfo = yield transporter.sendMail(mailOptions);
            console.log("Mail sent successfully", mailInfo.response);
            return {
                status: 200,
                message: "Success",
                data: mailInfo.response,
            };
        }
        catch (error) {
            console.error("Failed to send email:", error.message);
            throw error;
        }
    });
}
function generateJwtToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, SecretKey, {
        expiresIn: "1d",
    });
}
// Function to generate a random verification token
function generateOtp() {
    // Implement your logic for generating a token (e.g., using a library)
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}
function userSignUp(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, userName, email, password, phone, termsAndCondition, } = model;
        if (!firstName ||
            !lastName ||
            !userName ||
            !email ||
            !password ||
            !phone ||
            !termsAndCondition) {
            return {
                status: 400,
                message: "Bad Request",
                data: null,
            };
        }
        try {
            const existingUser = yield user_1.User.findOne({ email: email });
            if (existingUser) {
                if (existingUser.isActive === false) {
                    return {
                        status: 400,
                        message: "User exist mail verification pending",
                        data: null,
                    };
                }
                if (existingUser.isActive) {
                    return {
                        status: 400,
                        message: "user account already exist",
                        data: null,
                    };
                }
            }
            const hashPassword = yield encryptPassword(password);
            const newUser = yield user_1.User.create({
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                password: hashPassword,
                isActive: false,
                phone: phone,
                termsAndCondition: termsAndCondition,
            });
            if (!newUser) {
                return {
                    status: 400,
                    message: "User doesnt created",
                    data: null,
                };
            }
            const verificationToken = generateOtp();
            const verificationLink = `http://localhost:8008/${verificationToken}`;
            const subject = "Confirm your Email";
            const message = `Hi ${newUser.firstName},\n\nYour email was used to create an account in MindGen.com.\n\nPlease click on this link to confirm your account: ${verificationLink}\n\nThanks`;
            // const mailOptions = {
            //   from: "rajpurohitkaran2209@gmail.com",
            //   to: newUser.email,
            //   subject: "Email Verification",
            //   text: `Click the following link to verify your email: ${verificationLink}`,
            //   message: `Hi ${newUser.firstName},\n\nYour email was used to create an account in MindGen.com.\n\nPlease click on this link to confirm your account: ${verificationLink}\n\nThanks`,
            // };
            const userOtp = yield otp_1.Otp.create({
                userId: newUser._id,
                otp: verificationToken,
            });
            //await transporter.sendMail(mailOptions);
            yield sendMail(subject, message, newUser.email);
            return {
                status: 200,
                message: "Check your email for verification",
                data: null,
            };
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                message: "internal server error",
                data: null,
            };
        }
    });
}
exports.userSignUp = userSignUp;
function signUpverification(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const { otp, email } = model;
        if (!otp || !email) {
            return {
                status: 400,
                message: "Bad Request",
                data: null,
            };
        }
        try {
            const user = yield user_1.User.findOne({ email: email });
            if (!user) {
                return {
                    status: 404,
                    message: "User not found",
                    data: null,
                };
            }
            const verificationOtp = yield otp_1.Otp.findOne({ userId: user._id });
            // console.log(
            //   typeof verificationOtp?.otp,
            //   typeof parseInt(otp),
            //   verificationOtp?.otp === parseInt(otp)
            // );
            if ((verificationOtp === null || verificationOtp === void 0 ? void 0 : verificationOtp.otp) !== parseInt(otp)) {
                return {
                    status: 401,
                    message: "Otp was Expired",
                    data: null,
                };
            }
            user.isActive = true;
            yield user.save;
            const token = yield jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, SecretKey, { expiresIn: "1hr" });
            return {
                status: 200,
                message: "User Signed Up Successfully",
                data: token,
            };
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                message: "Internal server error",
                data: null,
            };
        }
    });
}
exports.signUpverification = signUpverification;
function userLogin(model) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = model;
        if (!email || !password) {
            return {
                status: 400,
                message: "Bad request",
                data: null,
            };
        }
        try {
            const user = yield user_1.User.findOne({ email: email });
            if (!user) {
                return {
                    status: 404,
                    message: "User not found",
                    data: null,
                };
            }
            if (user.isActive === false) {
                return {
                    status: 400,
                    message: "Incomplete SignUp process",
                    data: null,
                };
            }
            const hashPassword = user.password;
            const passwordVerification = yield bcrypt_1.default.compare(password, hashPassword);
            if (passwordVerification === false) {
                return {
                    status: 401,
                    message: "Invalid UserName or Password",
                    data: null,
                };
            }
            const token = generateJwtToken(user);
            return {
                status: 200,
                message: "Login Successfully",
                data: token,
            };
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                message: "internal server error",
                data: null,
            };
        }
    });
}
exports.userLogin = userLogin;
