import { app, logger } from "../../../app";
import request from "supertest";
import { authSignupResponse } from "../authModel";
import { StatusCodes } from "http-status-codes";

vi.mock("../authService", () => ({
  authService: {
    createUser: async () => ({ id: 0 }),
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

    it("should return unproccessable input if the email is invalid", async () => {
      const response = await request(app).post("/auth/signup").send({
        email: "bad-email.com",
        password: "test",
      });

      expect(response.statusCode).toEqual(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });
});
