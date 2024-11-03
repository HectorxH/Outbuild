import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { OutbuildApiError } from "../models/error";
import { StatusCodes } from "http-status-codes";
import { jwtConfig } from "../utils/configs";

const jwtPayload = z.object({
  id: z.number(),
});
type JWTPayload = {
  id: number;
};

const generateJWT = (payload: JWTPayload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expireTime,
    algorithm: jwtConfig.algorithm,
  });
};

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.split(" ")[1];

  try {
    if (!token) {
      throw new OutbuildApiError(
        "NoAuthError",
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Invalid 'Authorization' header.",
      );
    }

    const payload = jwtPayload.parse(jwt.verify(token, jwtConfig.secret));
    req.auth = payload;
    next();
  } catch (e) {
    next(e);
  }
};

export type { JWTPayload };
export { generateJWT, authenticateJWT };
