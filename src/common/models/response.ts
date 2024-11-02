import z, { ZodTypeAny } from "zod";

export function apiResponse<DataType extends ZodTypeAny>(data: DataType) {
  return z.object({
    data: data,
  });
}
