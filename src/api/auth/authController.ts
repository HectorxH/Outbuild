import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";

import { authBody, AuthLoginResponse, AuthSignupResponse } from "./authModel";
import { generateJWT } from "../../common/middleware/jwt";
import { authService } from "./authService";
import { validateBody } from "../../common/utils/validation";
import { OutbuildApiError } from "../../common/models/error";
import { StatusCodes } from "http-status-codes";

class AuthController {
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = await validateBody(authBody, req.body);
      const password_hash = await argon2.hash(password);
      const user = await authService.createUser({ email, password_hash });

      const body: AuthSignupResponse = { data: { id: user.id } };
      res.status(200).json(body);
    } catch (e) {
      next(e);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = await validateBody(authBody, req.body);
      const user = await authService.findUserByEmail(email);

      if (!(await argon2.verify(user.password_hash, password))) {
        throw new OutbuildApiError(
          "LoginError",
          StatusCodes.UNAUTHORIZED,
          "Invalid password.",
        );
      }

      const token = generateJWT({ id: user.id });

      const body: AuthLoginResponse = { data: { token } };
      res.status(200).json(body);
    } catch (e) {
      next(e);
    }
  };
}

export const authController = new AuthController();
