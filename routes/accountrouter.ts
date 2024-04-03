import { Router } from "express";
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
 *       summary: Login User
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
 *   /api/account/resetPasswordLink:
 *     get:
 *       summary: Login User
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
 *       summary: Login User
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
