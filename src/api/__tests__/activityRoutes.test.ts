import { app } from "../../app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import * as jwtmiddleware from "../../common/middleware/jwt";
import { NewActivity } from "../../common/db/types";
import { activityService } from "../activity/activityService";
import {
  activitiesResponse,
  activityPostResponse,
} from "../activity/activityModel";
import { errorResponse } from "../../common/models/error";

vi.mock("../../common/middleware/jwt", async (importOriginal) => {
  const original: typeof jwtmiddleware = await importOriginal();
  return {
    ...original,
    authenticateJWT: async (
      req: Request,
      _res: Response,
      next: NextFunction,
    ) => {
      req.auth = { id: 0 };
      next();
    },
  };
});

vi.mock("../schedule/scheduleService", () => {
  const service = {
    // User of id 0 owns all schedules for testing purposes
    checkScheduleOwnership: async (user_id: number) => user_id === 0,
  };

  return { scheduleService: service };
});

vi.mock("../activity/activityService", () => {
  const service: typeof activityService = {
    createActivities: async (newActivity: NewActivity[]) =>
      newActivity.map((schedule, id) => ({
        ...schedule,
        created_at: new Date(),
        id,
      })),
    getActivities: async (schedule_id: number) => [
      {
        id: 0,
        schedule_id,
        name: "test1",
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
      },
      {
        id: 1,
        schedule_id,
        name: "test2",
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
      },
    ],
  };
  return { activityService: service };
});

describe("Schedule Endpoints", () => {
  describe("POST /schedule/:schedule_id/activity", () => {
    it("should create a new activity on the given schedule", async () => {
      const requestBody = {
        name: "test",
        start_date: new Date(),
        end_date: new Date(),
      };
      const response = await request(app)
        .post("/schedule/0/activity")
        .send(requestBody)
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const responseBody = activityPostResponse.parse(response.body);
      expect(responseBody.data.schedule_id).toEqual(0);
      expect(responseBody.data.name).toEqual(requestBody.name);
      expect(responseBody.data.start_date).toEqual(requestBody.start_date);
      expect(responseBody.data.end_date).toEqual(requestBody.end_date);
    });

    it("should return unprocessable entity if given invalid date", async () => {
      const requestBody = {
        name: "test",
        start_date: "Not a Date",
        end_date: new Date(),
      };
      const response = await request(app)
        .post("/schedule/test/activity")
        .send(requestBody)
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      const responseBody = errorResponse.parse(response.body);
      expect(responseBody.error.name).toEqual("RequestValidationError");
    });
  });

  describe("POST /schedule/:schedule_id/activitiesBulk", () => {
    it("should create all new activities on the given schedule", async () => {
      const requestBody = Array(5)
        .fill(0)
        .map((_, idx: number) => ({
          name: `test-${idx}`,
          start_date: new Date(),
          end_date: new Date(),
        }));
      const response = await request(app)
        .post("/schedule/0/activitiesBulk")
        .send(requestBody)
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const responseBody = activitiesResponse.parse(response.body);
      expect(responseBody.data[0].schedule_id).toEqual(0);
      expect(responseBody.data[2].schedule_id).toEqual(0);
      expect(responseBody.data[0].name).toEqual(requestBody[0].name);
      expect(responseBody.data[1].name).toEqual(requestBody[1].name);
      expect(responseBody.data[0].start_date).toEqual(
        requestBody[0].start_date,
      );
      expect(responseBody.data[0].end_date).toEqual(requestBody[0].end_date);
    });

    it("should return unprocessable entity if given invalid date", async () => {
      const requestBody = [
        {
          name: "test",
          start_date: "Not a Date",
          end_date: new Date(),
        },
      ];
      const response = await request(app)
        .post("/schedule/0/activitiesBulk")
        .send(requestBody)
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      const responseBody = errorResponse.parse(response.body);
      expect(responseBody.error.name).toEqual("RequestValidationError");
    });
  });

  describe("GET /schedule/:schedule_id/activities", () => {
    it("should create a new activity on the given schedule", async () => {
      const response = await request(app)
        .get("/schedule/0/activities")
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const responseBody = activitiesResponse.parse(response.body);
      expect(responseBody.data[0].id).toEqual(0);
      expect(responseBody.data[1].id).toEqual(1);
      expect(responseBody.data[0].name).toEqual("test1");
    });
  });
});
