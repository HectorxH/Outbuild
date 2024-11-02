import { NextFunction, Request, Response } from "express";
import { scheduleGetParam, schedulePostBody } from "./schedulesModel";
import { NewSchedule } from "../../common/db/types";
import { db } from "../../common/db/db";

class ScheduleController {
  public createEmptySchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, url } = schedulePostBody.parse(req.body);
      const { id } = req.auth;
      const newSchedule: NewSchedule = { name, url, user_id: id };

      const schedule = await db
        .insertInto("schedule")
        .values(newSchedule)
        .returningAll()
        .executeTakeFirstOrThrow();

      res.status(200).json(schedule);
    } catch (e) {
      next(e);
    }
  };

  public getSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { schedule_id } = scheduleGetParam.parse(req.params);

      const schedule = await db
        .selectFrom("schedule")
        .where("id", "=", schedule_id)
        .selectAll()
        .executeTakeFirstOrThrow();

      res.status(200).json(schedule);
    } catch (e) {
      next(e);
    }
  };
}

export const scheduleController = new ScheduleController();
