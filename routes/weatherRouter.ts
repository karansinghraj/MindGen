import { Router } from "express";
import * as weathercontroller from "../controller/weatherController";

const weatherRoute = Router();

/**
 * @swagger
 * paths:
 *   /api/feature/v1/getCityWeather:
 *     get:
 *       summary: Get weather detail
 *       tags: [ Feature ]
 *       parameters:
 *         - in: query
 *           name: city
 *           schema:
 *             type: string
 *           required: true
 *           description: Nmae of the city
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
 *                   data:
 *                     type: string
 *                     description: Weather data
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

weatherRoute.get("/v1/getCityWeather", weathercontroller.getWeather);

export { weatherRoute };
