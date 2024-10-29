import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as swaggerUi from "swagger-ui-express";

import users from "./routes/users";
import schedules from "./routes/schedules";
import activities from "./routes/activities";
import swaggerJSDoc from "swagger-jsdoc";

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

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

app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
});
