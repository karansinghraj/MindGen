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
// import all the things we need
//const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require("mongoose");
// const User = require("../models/User");
const user_1 = require("../schema/user");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
// const ClientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const clientID = process.env.GOOGLE_CLIENT_ID;
if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT Secret key is not available for environment");
}
const SecretKey = process.env.JWT_SECRET_KEY;
function generateJwtToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, SecretKey, {
        expiresIn: "1d",
    });
}
//module.exports = function (passport: any) {
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are missing.");
}
passport_1.default.use(new passport_google_oauth20_1.Strategy(
/** @type {StrategyOptions} */
{
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:8008/api/auth/login/google/redirect",
    // scope: ["email", "profile"],
    scope: "email profile",
    passReqToCallback: true,
}, (req, // The first argument of the callback function is req, which represents the request object.
accessToken, refreshToken, 
//params: GoogleCallbackParameters,
profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    //get the user data from google
    // const newUser = {
    //   googleId: profile.id,
    //   displayName: profile.displayName,
    //   firstName: profile.name.givenName,
    //   lastName: profile.name.familyName,
    //   email: profile.emails[0].value
    // }
    try {
        //find the user in our database
        let user = yield user_1.User.findOne({ email: profile.emails });
        if (user) {
            //If user present in our database.
            // const token = generateJwtToken(user);
            // if (!token) {
            //   return done(new Error("Failed to generate JWT token"), false);
            // }
            return done(null, (user) => {
                return jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, SecretKey, {
                    expiresIn: "1d",
                });
            });
        }
        else {
            // if user is not preset in our database save user data to database.
            const newUser = new user_1.User({
                firstName: profile.name,
                lastName: profile.name,
                email: profile.emails, //? profile.emails[0].value : "",
                password: profile.id, // Store Google ID in the password field
                isActive: true,
                termsAndCondition: true,
                googleLogin: true,
            });
            // const user = await User.save();
            user = yield user_1.User.create(newUser);
            const token = generateJwtToken(user);
            return done(null, (user) => {
                return jsonwebtoken_1.default.sign({ sub: user._id, email: user.email }, SecretKey, {
                    expiresIn: "1d",
                });
            });
        }
    }
    catch (err) {
        console.error(err);
        return {
            status: 500,
            message: "Error authentication google login",
            data: null,
        };
    }
})));
// };
// used to serialize the user for the session
//   passport.serializeUser((user, done) => {
//     done(null, user.id)
//   })
// used to deserialize the user
//   passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => done(err, user))
//   })
// }
