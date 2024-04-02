import { User } from "../schema/user";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
//const JWT = require("jsonwebtoken");
import nodemailer from "nodemailer";
import { Otp } from "../schema/otp";
//const nodemailer =  require("nodemailer")
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not provided");
}

const SecretKey = process.env.JWT_SECRET_KEY;

async function encryptPassword(passsword: any) {
  const saltRound = 10; // No of time it gone Hash
  const hashPassword = await bcrypt.hash(passsword, saltRound);
  return hashPassword;
}

async function sendMail(subject: string, message: string, email: string) {
  try {
    const transporter = nodemailer.createTransport({
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

    const mailInfo = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully", mailInfo.response);
    return {
      status: 200,
      message: "Success",
      data: mailInfo.response,
    };
  } catch (error: any) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
}

function generateJwtToken(user: any) {
  return JWT.sign({ sub: user._id, email: user.email }, SecretKey, {
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

async function userSignUp(model: any) {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
    termsAndCondition,
  } = model;

  if (
    !firstName ||
    !lastName ||
    !userName ||
    !email ||
    !password ||
    !phone ||
    !termsAndCondition
  ) {
    return {
      status: 400,
      message: "Bad Request",
      data: null,
    };
  }
  try {
    const existingUser = await User.findOne({ email: email });
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

    const hashPassword = await encryptPassword(password);

    const newUser = await User.create({
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

    const userOtp = await Otp.create({
      userId: newUser._id,
      otp: verificationToken,
    });

    //await transporter.sendMail(mailOptions);
    await sendMail(subject, message, newUser.email);

    return {
      status: 200,
      message: "Check your email for verification",
      data: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "internal server error",
      data: null,
    };
  }
}

async function signUpverification(model: any) {
  const { otp, email } = model;
  if (!otp || !email) {
    return {
      status: 400,
      message: "Bad Request",
      data: null,
    };
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return {
        status: 404,
        message: "User not found",
        data: null,
      };
    }
    const verificationOtp = await Otp.findOne({ userId: user._id });
    // console.log(
    //   typeof verificationOtp?.otp,
    //   typeof parseInt(otp),
    //   verificationOtp?.otp === parseInt(otp)
    // );
    if (verificationOtp?.otp !== parseInt(otp)) {
      return {
        status: 401,
        message: "Otp was Expired",
        data: null,
      };
    }

    user.isActive = true;
    await user.save;

    const token = await JWT.sign(
      { sub: user._id, email: user.email },
      SecretKey,
      { expiresIn: "1hr" }
    );

    return {
      status: 200,
      message: "User Signed Up Successfully",
      data: token,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server error",
      data: null,
    };
  }
}

async function userLogin(model: any) {
  const { email, password } = model;
  if (!email || !password) {
    return {
      status: 400,
      message: "Bad request",
      data: null,
    };
  }

  try {
    const user = await User.findOne({ email: email });
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
    const passwordVerification = await bcrypt.compare(password, hashPassword);
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
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "internal server error",
      data: null,
    };
  }
}

export { userSignUp, userLogin, signUpverification };
