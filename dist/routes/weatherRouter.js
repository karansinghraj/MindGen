"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weatherRoute = void 0;
const express_1 = require("express");
const weathercontroller = __importStar(require("../controller/weatherController"));
const weatherRoute = (0, express_1.Router)();
exports.weatherRoute = weatherRoute;
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
 *           description: Name of the city
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
/**
 * @swagger
 * paths:
 *   /api/feature/v1/getCityTimeZone:
 *     get:
 *       summary: Get weather detail
 *       tags: [ Feature ]
 *       parameters:
 *         - in: query
 *           name: city
 *           schema:
 *             type: string
 *           required: true
 *           description: Name of the city
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
weatherRoute.get("/v1/getCityTimeZone", weathercontroller.getCityTimeZone);
/**
 * @swagger
 * paths:
 *   /api/feature/v1/astronomyUpdate:
 *     get:
 *       summary: Get weather detail
 *       tags: [ Feature ]
 *       parameters:
 *         - in: query
 *           name: city
 *           schema:
 *             type: string
 *           required: true
 *           description: Name of the city
 *         - in: query
 *           name: date
 *           schema:
 *             type: string
 *             example: DD/MM/YY
 *           required: true
 *           description:
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
weatherRoute.get("/v1/astronomyUpdate", weathercontroller.astronomyUpdate);
