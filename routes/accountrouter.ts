import { Router } from "express";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import {
  resetPassword,
  resetPasswordLink,
  signUpverification,
  userLogin,
  userSignUp,
} from "../controller/accountController";

const accRoute = Router();

/**
 * @swagger
 * /api/account/signup:
 *   post:
 *    summary: User signUp Api
 *    description: Api for new user signup
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *                description: The first name of the user
 *              lastName:
 *                type: string
 *                description: The last name of the user
 *              userName:
 *                type: string
 *                description: The username of the user
 *              email:
 *                type: string
 *                format: email
 *                description: The email address of the user
 *              password:
 *                type: string
 *                format: password
 *                description: The password of the user
 *              phone:
 *                type: string
 *                description: The phone number of the user
 *              termsAndCondition:
 *                type: boolean
 *                description: Indicates if the user agrees to the terms and conditions
 *    responses:
 *      '200':
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: number
 *                message:
 *                  type: string
 *                data:
 *                  type: null
 *      '500':
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: An error message
 *
 */

accRoute.post("/account/signup", userSignUp);

/**
 * @swagger
 * paths:
 *   /api/account/signupverification:
 *     get:
 *       summary: Api for verifying signup user
 *       parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           required: true
 *           description: The email address of the user
 *         - in: query
 *           name: otp
 *           schema:
 *             type: number
 *           required: true
 *           description: The password of the user
 *       responses:
 *         '200':
 *           description: Successful login
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: number
 *                     description: status code
 *                   message:
 *                     type: string
 *                     description: A success message
 *                   token:
 *                     type: string
 *                     description: An authentication token
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 */

accRoute.get("/account/signupverification", signUpverification);

/**
 * @swagger
 * paths:
 *   /api/account/login:
 *     get:
 *       summary: Login User
 *       parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           required: true
 *           description: The email address of the user
 *         - in: query
 *           name: password
 *           schema:
 *             type: string
 *           required: true
 *           description: The password of the user
 *       responses:
 *         '200':
 *           description: Successful login
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: number
 *                     description: status code
 *                   message:
 *                     type: string
 *                     description: A success message
 *                   token:
 *                     type: string
 *                     description: An authentication token
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 */

accRoute.get("/account/login", userLogin);

/**
 * @swagger
 * paths:
 *   /api/auth/login/google:
 *     get:
 *       summary: Google Login
 *       description: Google Login
 *       tags: [Login]
 *       responses:
 *         '200':
 *           description: Successful login
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: number
 *                     description: status code
 *                   message:
 *                     type: string
 *                     description: A success message
 *                   token:
 *                     type: string
 *                     description: An authentication token
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 */

accRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

accRoute.get(
  "/google/redirect",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", (err: any, token: string) => {
      if (err) {
        // If an error occurs during authentication, return the error
        return res
          .status(500)
          .json({ message: "Authentication failed", error: err });
      }
      if (!token) {
        // If authentication fails (no token generated), return 401 status
        return res.status(401).json({ message: "Unauthorized" });
      }
      // If authentication is successful, return the token
      // createNewToken(token);
      return (
        res
          .status(200)
          // .json({ token });
          .redirect(`http://localhost:8008?token=${token}`)
      ); //?token=${token}
    })(req, res, next);
  }
);

/**
 * @swagger
 * paths:
 *   /api/account/resetPasswordLink:
 *     get:
 *       summary: Api for sending password reset link
 *       parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           required: true
 *           description: The email address of the user
 *       responses:
 *         '200':
 *           description: Successful login
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: number
 *                     description: status code
 *                   message:
 *                     type: string
 *                     description: A success message
 *                   token:
 *                     type: string
 *                     description: An authentication token
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 */

accRoute.get("/account/resetPasswordLink", resetPasswordLink);

/**
 * @swagger
 * paths:
 *   /api/account/resetpassword:
 *     put:
 *       summary: Api for reset Password
 *       parameters:
 *         - in: query
 *           name: token
 *           schema:
 *             type: string
 *           required: true
 *           description: The email address of the user
 *         - in: query
 *           name: newPassword
 *           schema:
 *             type: string
 *           required: true
 *           description: The password of the user
 *         - in: query
 *           name: confirmNewPassword
 *           schema:
 *             type: string
 *           required: true
 *           description: The password of the user
 *       responses:
 *         '200':
 *           description: Successful login
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: number
 *                     description: status code
 *                   message:
 *                     type: string
 *                     description: A success message
 *                   token:
 *                     type: string
 *                     description: An authentication token
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 *         '500':
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: An error message
 */

accRoute.put("/account/resetpassword", resetPassword);

export { accRoute };
