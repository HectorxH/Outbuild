/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, Request, NextFunction } from "express";
import { logger } from "../../app";
import { StatusCodes } from "http-status-codes";
import { ErrorResponse, OutbuildApiError } from "../models/error";

// Needs to take the four parameters explicitly for express to
// consider it a error handler middleware.
const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err);

  const status =
    err instanceof OutbuildApiError
      ? err.httpCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  const body: ErrorResponse = {
    error: {
      name: err.name,
      message: err.message,
    },
  };

  res.status(status).json(body);
};

export default errorHandler;
