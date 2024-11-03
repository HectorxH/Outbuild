import z from "zod";
import { apiResponse } from "../../common/models/response";

export const schedulePostBody = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const scheduleGetParam = z.object({ schedule_id: z.coerce.number() });

export const scheduleResponse = apiResponse(
  z.object({
    id: z.number(),
    user_id: z.number(),
    name: z.string(),
    url: z.string().url(),
    created_at: z.coerce.date(),
  }),
);
export type ScheduleResponse = z.infer<typeof scheduleResponse>;
