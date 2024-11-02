import express from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import * as swaggerUi from "swagger-ui-express";
import { createDocument } from "zod-openapi";

import auth, { authOpenApi } from "./api/auth/authRoutes";
import schedules, { schedulesOpenApi } from "./api/schedules/schedulesRoutes";
import activities, { activitiesOpenApi } from "./api/activities/activityRoutes";
import errorHandler from "./common/middleware/errorHandler";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

// Logging
const logger = pino();
app.use(pinoHttp());

// Routes
app.use("/", auth);
app.use("/", schedules);
app.use("/", activities);

// Docs
const spec = createDocument({
  openapi: "3.0.0",
  info: {
    title: "Outbuild API",
    version: "1.0.0",
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
  paths: {
    ...authOpenApi,
    ...schedulesOpenApi,
    ...activitiesOpenApi,
  },
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// Error handler
app.use(errorHandler);

export { app, logger };
