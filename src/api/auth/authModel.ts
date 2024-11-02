import z from "zod";
import { apiResponse } from "../../common/models/response";

export const authBody = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type AuthBody = z.infer<typeof authBody>;

export const authSignupResponse = apiResponse(
  z.object({
    id: z.number(),
  }),
);
export type AuthSignupResponse = z.infer<typeof authSignupResponse>;
