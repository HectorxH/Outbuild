import express from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { scheduleController } from "./schedulesController";
import { scheduleGetParam, schedulePostBody } from "./schedulesModel";
import { authenticateJWT } from "../../common/middleware/jwt";

const router = express.Router();

const schedulesOpenApi: ZodOpenApiPathsObject = {};

router.post(
  "/schedule",
  authenticateJWT,
  scheduleController.createEmptySchedule,
);
schedulesOpenApi["/schedule"] = {
  post: {
    description: "Create an empty schedule (with no activities) in the system.",
    summary: "Create a schedule.",
    tags: ["schedules"],
    security: [{ bearerAuth: [] }],
    requestBody: {
      content: {
        "application/json": {
          schema: schedulePostBody,
        },
      },
    },
    responses: {
      200: {
        description: "New Schedule.",
      },
    },
  },
};

router.get(
  "/schedule/:schedule_id",
  authenticateJWT,
  scheduleController.getSchedule,
);
schedulesOpenApi["/schedule/{schedule_id}"] = {
  get: {
    description: "Retrieve a schedule along with its activities.",
    summary: "Retrive a schedule.",
    tags: ["schedules"],
    security: [{ bearerAuth: [] }],
    requestParams: { path: scheduleGetParam },
    responses: {
      200: {
        description: "New Schedule.",
      },
    },
  },
};

export default router;
export { schedulesOpenApi };
