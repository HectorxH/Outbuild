import z from "zod";
import { apiResponse } from "../../common/models/response";

export const activityParams = z.object({
  schedule_id: z.coerce.number(),
});

export const activityPostBody = z.object({
  name: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});

const activityBaseResponse = z.object({
  id: z.number(),
  schedule_id: z.number(),
  name: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  created_at: z.coerce.date(),
});

export const activityPostResponse = apiResponse(activityBaseResponse);
export type ActivityPostResponse = z.infer<typeof activityPostResponse>;

export const activitiesPostBody = z.array(activityPostBody);

export const activitiesResponse = apiResponse(z.array(activityBaseResponse));
export type ActivitiesResponse = z.infer<typeof activitiesResponse>;
