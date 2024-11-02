import express from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";
import { authController } from "./authController";
import { authBody, authSignupResponse } from "./authModel";

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
      200: {
        content: {
          "application/json": {
            schema: authSignupResponse,
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
      200: {
        description: "New User.",
      },
    },
  },
};

export default router;
export { authOpenApi };
