import express from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { activityController } from "./activityController";
import { authenticateJWT } from "../../common/middleware/jwt";
import {
  activitiesPostBody,
  activitiesResponse,
  activityParams,
  activityPostBody,
  activityPostResponse,
} from "./activityModel";
import {
  pagination,
  paginationParams,
} from "../../common/middleware/pagination";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../../common/models/error";

const router = express.Router();
const activitiesOpenApi: ZodOpenApiPathsObject = {};

router.post(
  "/schedule/:schedule_id/activity",
  authenticateJWT,
  activityController.createActivity,
);
activitiesOpenApi["/schedule/{schedule_id}/activity"] = {
  post: {
    description: "Add a new activity to the given schedule.",
    summary: "Add a new activity to a schedule",
    tags: ["activity"],
    security: [{ bearerAuth: [] }],
    requestParams: { path: activityParams },
    requestBody: {
      content: {
        "application/json": {
          schema: activityPostBody,
        },
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Ok",
        content: {
          "application/json": {
            schema: activityPostResponse,
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

router.post(
  "/schedule/:schedule_id/activitiesBulk",
  authenticateJWT,
  activityController.createActivities,
);
activitiesOpenApi["/schedule/{schedule_id}/activitiesBulk"] = {
  post: {
    description: "Add a list of new activities to the given schedule.",
    summary: "Add a multiple activities to the schedule",
    tags: ["activity"],
    security: [{ bearerAuth: [] }],
    requestParams: { path: activityParams },
    requestBody: {
      content: {
        "application/json": {
          schema: activitiesPostBody,
        },
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Ok",
        content: {
          "application/json": {
            schema: activitiesResponse,
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
  "/schedule/:schedule_id/activities",
  authenticateJWT,
  pagination,
  activityController.getActivities,
);
activitiesOpenApi["/schedule/{schedule_id}/activities"] = {
  get: {
    description: "Get all activities from a schedule. Supports pagination.",
    summary: "Get all activities from a schedule.",
    tags: ["activity"],
    security: [{ bearerAuth: [] }],
    requestParams: {
      path: activityParams,
      query: paginationParams,
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Ok",
        content: {
          "application/json": {
            schema: activitiesResponse,
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
export { activitiesOpenApi };
