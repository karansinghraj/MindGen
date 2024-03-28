import { User } from "../schema/user";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
//const JWT = require("jsonwebtoken");
import nodemailer from "nodemailer";
import { Otp } from "../schema/otp";
//const nodemailer =  require("nodemailer")

const salt = 8;
const SecretKey = "Secret_key";

async function encryptPassword(passsword: any) {
  const hashPassword = await bcrypt.hash(passsword, salt);
  return hashPassword;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  tls: true,
  auth: {
    user: "rajpurohitkaran2209@gmail.com",
    pass: "seck sxvf dnzl xuzp",
  },
} as nodemailer.TransportOptions);

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

    const user = await User.create({
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

    const userOtp = await Otp.create({
      userId: user._id,
      otp: verificationToken,
    });

    await transporter.sendMail(mailOptions);

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
    console.log(
      typeof verificationOtp?.otp,
      typeof parseInt(otp),
      verificationOtp?.otp === parseInt(otp)
    );
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
      { expiresIn: "" }
    );

    return {
      status: 200,
      message: "User Signed Up Successfully",
      data: token,
    };
  } catch (error) {
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

    const token = await JWT.sign(
      { sub: user._id, email: user.email },
      SecretKey,
      { expiresIn: "" }
    );

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
