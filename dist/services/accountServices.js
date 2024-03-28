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
const salt = 8;
const SecretKey = "Secret_key";
function encryptPassword(passsword) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashPassword = yield bcrypt_1.default.hash(passsword, salt);
        return hashPassword;
    });
}
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls: true,
    auth: {
        user: "rajpurohitkaran2209@gmail.com",
        pass: "seck sxvf dnzl xuzp",
    },
});
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
            const user = yield user_1.User.create({
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                password: hashPassword,
                isActive: false,
                phone: phone,
                termsAndCondition: termsAndCondition,
            });
            if (!user) {
                return {
                    status: 400,
                    message: "User doesnt created",
                    data: null,
                };
            }
            const verificationToken = generateOtp();
            const verificationLink = `http://yourapp.com/verify/${verificationToken}`;
            const mailOptions = {
                from: "rajpurohitkaran2209@gmail.com",
                to: user.email,
                subject: "Email Verification",
                text: `Click the following link to verify your email: ${verificationLink}`,
                message: "Verification code for Signup is " + verificationToken,
            };
            const userOtp = yield otp_1.Otp.create({
                userId: user._id,
                otp: verificationToken,
            });
            yield transporter.sendMail(mailOptions);
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
            console.log(typeof (verificationOtp === null || verificationOtp === void 0 ? void 0 : verificationOtp.otp), typeof parseInt(otp), (verificationOtp === null || verificationOtp === void 0 ? void 0 : verificationOtp.otp) === parseInt(otp));
            if ((verificationOtp === null || verificationOtp === void 0 ? void 0 : verificationOtp.otp) !== parseInt(otp)) {
                return {
                    status: 401,
                    message: "Otp was Expired",
                    data: null,
                };
            }
            user.isActive = true;
            yield user.save;
            return {
                status: 200,
                message: "User Signed Up Successfully",
                data: null,
            };
        }
        catch (error) {
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
            const token = yield jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, SecretKey, { expiresIn: "" });
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
