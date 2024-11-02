import z from "zod";

export const activityParams = z.object({
  schedule_id: z.number(),
});

export const activityPostBody = z.object({
  name: z.string(),
  start_date: z.date(),
  end_date: z.date(),
});

export const activitiesPostBody = z.array(activityPostBody);
