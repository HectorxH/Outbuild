import { app, logger } from "../../../app";
import request from "supertest";
import { authLoginResponse, authSignupResponse } from "../authModel";
import { StatusCodes } from "http-status-codes";
import { OutbuildUser } from "../../../common/db/types";
import argon2 from "argon2";
import { errorResponse } from "../../../common/models/error";

vi.mock("../authService", () => ({
  authService: {
    createUser: async () => ({ id: 0 }),
    findUserByEmail: async (): Promise<OutbuildUser> => ({
      id: 0,
      email: "test@gmail.com",
      password_hash: await argon2.hash("test"),
      created_at: new Date(),
    }),
  },
}));

describe("Auth Endpoints", () => {
  describe("POST /auth/signup", () => {
    it("should create a new user", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "test@gmail.com",
        password: "test",
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const responseBody = authSignupResponse.parse(response.body);
      expect(responseBody.data).toEqual({ id: 0 });
    });

    it("should return unproccessable entity for invalid email format", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "bad-email.com",
        password: "test",
      });

      expect(response.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      const responseBody = errorResponse.parse(response.body);
      expect(responseBody.error.name).toEqual("RequestValidationError");
    });
  });

  describe("POST /auth/login", () => {
    it("should return token", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@gmail.com",
        password: "test",
      });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const responseBody = authLoginResponse.parse(response.body);
      expect(responseBody.data).toHaveProperty("token");
    });

    it("should return unauthorized for invalid password", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "test@gmail.com",
        password: "badpassword",
      });

      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
      const responseBody = errorResponse.parse(response.body);
      expect(responseBody.error.name).toEqual("LoginError");
    });

    it("should return unproccessable entity for invalid email format", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "bad-email.com",
        password: "test",
      });

      expect(response.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
      const responseBody = errorResponse.parse(response.body);
      expect(responseBody.error.name).toEqual("RequestValidationError");
    });
  });
});
