import express from "express";
import { db } from "./dbconfig/db";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { accRoute } from "./routes/accountrouter";
const port = 8008;
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

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", accRoute);

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
