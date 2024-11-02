import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import z from "zod";

const accessSecret = process.env.JWT_ACCESS_SECRET || "sample_secret_token";
const algorithm = "HS256";

const expireTime = 20; // In minutes

const jwtPayload = z.object({
  id: z.number(),
});
type JWTPayload = {
  id: number;
};

const generateJWT = (payload: JWTPayload) => {
  return jwt.sign(payload, accessSecret, { expiresIn: expireTime, algorithm });
};

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.split(" ")[1];

  if (!token) {
    next(new Error("No authorization token."));
  }

  try {
    const payload = jwtPayload.parse(jwt.verify(token, accessSecret));
    req.auth = payload;
    next();
  } catch (e) {
    next(e);
  }
};

export type { JWTPayload };
export { generateJWT, authenticateJWT };
