import z from "zod";

export function apiResponse<DataType extends z.ZodTypeAny>(data: DataType) {
  return z.object({
    data: data,
  });
}
