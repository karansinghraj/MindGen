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
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoclustername = process.env.mongoclustername;
const mongopass = process.env.mongopass;
const URI = `mongodb+srv://mindgen:${mongoclustername}@cluster0.${mongopass}.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const Url = "mongodb://127.0.0.1:27017/MindGen";
const Url = `mongodb+srv://mindgen:XiXus9gCKbhpnMo6@cluster0.an7zbym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const db = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(Url);
        console.log("Successfully connected to mongoDB");
    }
    catch (error) {
        console.log("MongoDB connection Error", error);
    }
});
exports.db = db;
