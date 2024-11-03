import { StatusCodes } from "http-status-codes";
import { z, ZodTypeAny } from "zod";
import { OutbuildApiError } from "../models/error";

export async function validateBody<SchemaType extends ZodTypeAny>(
  schema: SchemaType,
  body: unknown,
): Promise<z.infer<SchemaType>> {
  const result = await schema.safeParseAsync(body);
  if (!result.success) {
    throw new OutbuildApiError(
      "RequestValidationError",
      StatusCodes.UNPROCESSABLE_ENTITY,
      `Invalid request body: ${result.error.message}`,
    );
  }

  return result.data;
}

export async function validateParams<SchemaType extends ZodTypeAny>(
  schema: SchemaType,
  body: unknown,
): Promise<z.infer<SchemaType>> {
  const result = await schema.safeParseAsync(body);
  if (!result.success) {
    throw new OutbuildApiError(
      "RequestValidationError",
      StatusCodes.UNPROCESSABLE_ENTITY,
      `Invalid request params: ${result.error.message}`,
    );
  }

  return result.data;
}
