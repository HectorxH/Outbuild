import express from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { activityController } from "./activityController";
import { authenticateJWT } from "../../common/middleware/jwt";
import { activitiesPostBody, activityPostBody } from "./activityModel";
import {
  pagination,
  paginationParams,
} from "../../common/middleware/pagination";

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
    summary: "Add a new activity to the schedule",
    tags: ["activity"],
    security: [{ bearerAuth: [] }],
    requestBody: {
      content: {
        "application/json": {
          schema: activityPostBody,
        },
      },
    },
    responses: {
      200: {
        description: "New User.",
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
    requestBody: {
      content: {
        "application/json": {
          schema: activitiesPostBody,
        },
      },
    },
    responses: {
      200: {
        description: "New User.",
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
      path: paginationParams,
    },
    requestBody: {
      content: {
        "application/json": {
          schema: activitiesPostBody,
        },
      },
    },
    responses: {
      200: {
        description: "New User.",
      },
    },
  },
};

export default router;
export { activitiesOpenApi };
