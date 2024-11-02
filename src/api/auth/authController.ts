import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";

import { authBody, AuthSignupResponse } from "./authModel";
import { generateJWT } from "../../common/middleware/jwt";
import { authService } from "./authService";

class AuthController {
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = authBody.parse(req.body);
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
      const { email, password } = authBody.parse(req.body);

      const user = await authService.findUserByEmail(email);

      if (!argon2.verify(user.password_hash, password)) {
        next(new Error("Invalid password"));
      }

      const token = generateJWT({ id: user.id });

      res.status(200).json({ token });
    } catch (e) {
      next(e);
    }
  };
}

export const authController = new AuthController();
