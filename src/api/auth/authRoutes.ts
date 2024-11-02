import express from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { authController } from "./authController";
import { authBody, authLoginResponse, authSignupResponse } from "./authModel";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../../common/models/error";

const router = express.Router();
const authOpenApi: ZodOpenApiPathsObject = {};

router.post("/auth/signup", authController.signup);
authOpenApi["/auth/signup"] = {
  post: {
    description: "Create a new user account.",
    summary: "Create user.",
    tags: ["auth"],
    requestBody: {
      content: {
        "application/json": {
          schema: authBody,
        },
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Ok",
        content: {
          "application/json": {
            schema: authSignupResponse,
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
    },
  },
};

router.post("/auth/login", authController.login);
authOpenApi["/auth/login"] = {
  post: {
    description: "Login into a user account.",
    summary: "Login into a user account.",
    tags: ["auth"],
    requestBody: {
      content: {
        "application/json": {
          schema: authBody,
        },
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Ok",
        content: {
          "application/json": {
            schema: authLoginResponse,
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
export { authOpenApi };
