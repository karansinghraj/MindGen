// import all the things we need
//const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require("mongoose");
// const User = require("../models/User");
import { User } from "../schema/user";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport, { Profile } from "passport";
import { VerifiedCallback, VerifyCallback } from "passport-jwt";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";
import { error } from "console";

dotenv.config();

// const ClientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const clientID = process.env.GOOGLE_CLIENT_ID;

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT Secret key is not available for environment");
}
const SecretKey = process.env.JWT_SECRET_KEY;
function generateJwtToken(user: any) {
  return JWT.sign({ sub: user._id, email: user.email }, SecretKey, {
    expiresIn: "1d",
  });
}

//module.exports = function (passport: any) {
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are missing.");
}
passport.use(
  new GoogleStrategy(
    /** @type {StrategyOptions} */
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://localhost:8008/api/auth/login/google/redirect",
      // scope: ["email", "profile"],
      scope: "email profile",
      passReqToCallback: true,
    },
    async (
      req, // The first argument of the callback function is req, which represents the request object.
      accessToken: string,
      refreshToken: string,
      //params: GoogleCallbackParameters,
      profile: Profile,
      done: VerifyCallback
    ) => {
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
        let user = await User.findOne({ email: profile.emails });

        if (user) {
          //If user present in our database.
          // const token = generateJwtToken(user);
          // if (!token) {
          //   return done(new Error("Failed to generate JWT token"), false);
          // }
          return done(null, (user) => {
            return JWT.sign({ sub: user._id, email: user.email }, SecretKey, {
              expiresIn: "1d",
            });
          });
        } else {
          // if user is not preset in our database save user data to database.
          const newUser = new User({
            firstName: profile.name,
            lastName: profile.name,
            email: profile.emails, //? profile.emails[0].value : "",
            password: profile.id, // Store Google ID in the password field
            isActive: true,
            termsAndCondition: true,
            googleLogin: true,
          });
          // const user = await User.save();
          user = await User.create(newUser);
          const token = generateJwtToken(user);
          return done(null, (user) => {
            return JWT.sign({ sub: user._id, email: user.email }, SecretKey, {
              expiresIn: "1d",
            });
          });
        }
      } catch (err) {
        console.error(err);
        return {
          status: 500,
          message: "Error authentication google login",
          data: null,
        };
      }
    }
  )
);
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
