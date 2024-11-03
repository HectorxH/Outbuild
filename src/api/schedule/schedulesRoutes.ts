import express from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { scheduleController } from "./schedulesController";
import {
  scheduleGetParam,
  schedulePostBody,
  scheduleResponse,
} from "./schedulesModel";
import { authenticateJWT } from "../../common/middleware/jwt";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../../common/models/error";

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
      [StatusCodes.OK]: {
        description: "Ok",
        content: {
          "application/json": {
            schema: scheduleResponse,
          },
        },
      },
      [StatusCodes.UNPROCESSABLE_ENTITY]: {
        description: "Unprocessable Entity",
        content: {
          "application/json": {
            schema: errorResponse,
          },
        },
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: errorResponse,
          },
        },
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
    description: "Retrieve a schedule whitout its activities.",
    summary: "Retrive a schedule.",
    tags: ["schedules"],
    security: [{ bearerAuth: [] }],
    requestParams: { path: scheduleGetParam },
    responses: {
      [StatusCodes.OK]: {
        description: "Ok",
        content: {
          "application/json": {
            schema: scheduleResponse,
          },
        },
      },
      [StatusCodes.UNPROCESSABLE_ENTITY]: {
        description: "Unprocessable Entity",
        content: {
          "application/json": {
            schema: errorResponse,
          },
        },
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: errorResponse,
          },
        },
      },
    },
  },
};

export default router;
export { schedulesOpenApi };
