import express from "express";
import { db } from "./dbconfig/db";
import passport from "passport";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { accRoute } from "./routes/accountrouter";
import dotenv from "dotenv";
import { weatherRoute } from "./routes/weatherRouter";
import cors from "cors";
require("./middleware/googleAuth");

dotenv.config();

const port = process.env.PORT;
const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "MindGen",
      version: "0.0.1",
      description: "MindGen - Future",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// app.use(require("./routes/index"))
// app.use('/auth', require('./routes/auth'))

app.use("/api", accRoute);
app.use("/api/auth/login", accRoute);
app.use("/api/feature", weatherRoute);

(async () => {
  try {
    await db();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error: any) {
    console.log("connection error", error.message);
  }
})();
