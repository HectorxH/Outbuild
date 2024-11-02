import z from "zod";

export const schedulePostBody = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const scheduleGetParam = z.object({ schedule_id: z.number() });

export const scheduleResponse = z.object({
  data: z.object({
    id: z.number(),
    user_id: z.number(),
    name: z.string(),
    url: z.string().url(),
    createdAt: z.date(),
    activities: z.object({}),
  }),
});
