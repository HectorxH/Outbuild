import { app } from "../../app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import * as jwtmiddleware from "../../common/middleware/jwt";
import { NewSchedule } from "../../common/db/types";
import { scheduleService } from "../schedules/scheduleService";
import { scheduleResponse } from "../schedules/schedulesModel";
import { errorResponse } from "../../common/models/error";

vi.mock("../../common/middleware/jwt", async (importOriginal) => {
  const original: typeof jwtmiddleware = await importOriginal();
  return {
    ...original,
    authenticateJWT: async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      req.auth = { id: 0 };
      next();
    },
  };
});

vi.mock("../schedules/scheduleService", () => {
  const service: typeof scheduleService = {
    createSchedule: async (newSchedule: NewSchedule) => ({
      id: 0,
      user_id: newSchedule.user_id,
      name: newSchedule.name,
      url: newSchedule.url,
      created_at: new Date(),
    }),
    getScheduleById: async (id: number) => {
      if (id !== 0) {
        throw new Error();
      }
      return {
        id: 0,
        user_id: 0,
        name: "test",
        url: "http://www.test.com",
        created_at: new Date(),
      };
    },
  };
  return { scheduleService: service };
});

describe("Schedule Endpoints", () => {
  describe("POST /schedule", () => {
    it("should create a new user", async () => {
      const requestBody = {
        name: "test",
        url: "http://www.test.com",
      };
      const response = await request(app)
        .post(`/schedule`)
        .send(requestBody)
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const responseBody = scheduleResponse.parse(response.body);
      expect(responseBody.data.name).toEqual(requestBody.name);
      expect(responseBody.data.url).toEqual(requestBody.url);
      expect(responseBody.data.user_id).toEqual(0);
    });

    it("should return unprocessable entity if given a malformed url", async () => {
      const requestBody = {
        name: "test",
        url: "http:/ bad",
      };
      const response = await request(app)
        .post("/schedule")
        .send(requestBody)
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      const responseBody = errorResponse.parse(response.body);
      expect(responseBody.error.name).toEqual("RequestValidationError");
    });
  });

  describe("GET /schedule/:schedule_id", () => {
    it("should return the schedule of the given id", async () => {
      const response = await request(app)
        .get("/schedule/0")
        .auth("test-token", { type: "bearer" });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const responseBody = scheduleResponse.parse(response.body);
      expect(responseBody.data.id).toEqual(0);
    });
  });

  it("should return unprocessable entity if given non numeric id", async () => {
    const response = await request(app)
      .get("/schedule/test")
      .auth("test-token", { type: "bearer" });

    expect(response.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
    const responseBody = errorResponse.parse(response.body);
    expect(responseBody.error.name).toEqual("RequestValidationError");
  });
});
