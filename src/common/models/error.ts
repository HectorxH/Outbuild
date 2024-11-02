import { StatusCodes } from "http-status-codes";
import z from "zod";

export class OutbuildApiError extends Error {
  public readonly name: string;
  public readonly httpCode: StatusCodes;

  constructor(name: string, httpCode: StatusCodes, description: string) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;

    Error.captureStackTrace(this);
  }
}

export const errorResponse = z.object({
  error: z.object({
    name: z.string(),
    message: z.string(),
  }),
});
export type ErrorResponse = z.infer<typeof errorResponse>;
