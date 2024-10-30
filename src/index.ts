import express from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import * as swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import users from "./routes/users";
import schedules from "./routes/schedules";
import activities from "./routes/activities";
import { db } from "./db/db";

const api = {
  host: process.env.HOST || "localhost",
  port: process.env.PORT || "8000",
};

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Logging
const logger = pino();
app.use(pinoHttp());

// Routes
app.use("/users", users);
app.use("/schedules", schedules);
app.use("/activities", activities);

// Docs
const swaggerSpec = swaggerJSDoc({
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Outbuild API",
      version: "1.0.0",
      description: "An API to manage users, schedules and activities.",
    },
  },
  apis: ["src/routes/*.ts"],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = app.listen(api.port, () => {
  logger.info(`Server running on http://${api.host}:${api.port}`);
});

const shutDown = () => {
  logger.info("Shutting down...");
  server.close(() => {
    db.destroy();
  });
};

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
