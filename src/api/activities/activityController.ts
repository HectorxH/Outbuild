import { NextFunction, Request, Response } from "express";
import { NewActivity } from "../../common/db/types";
import { db } from "../../common/db/db";
import {
  activitiesPostBody,
  activityParams,
  activityPostBody,
} from "./activityModel";

class ActivityController {
  private _createSchedules = async (newActivities: NewActivity[]) => {
    const activities = await db
      .insertInto("activity")
      .values(newActivities)
      .returningAll()
      .execute();

    return activities;
  };

  public createActivity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, start_date, end_date } = activityPostBody.parse(req.body);
      const { schedule_id } = activityParams.parse(req.params);

      const newActivity: NewActivity = {
        name,
        start_date,
        end_date,
        schedule_id,
      };

      const activities = this._createSchedules([newActivity]);

      res.status(200).json(activities);
    } catch (e) {
      next(e);
    }
  };

  public createActivities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const activitiesBody = activitiesPostBody.parse(req.body);
      const { schedule_id } = activityParams.parse(req.params);

      const newActivities: NewActivity[] = activitiesBody.map((activity) => ({
        ...activity,
        schedule_id,
      }));

      const activities = this._createSchedules(newActivities);

      res.status(200).json(activities);
    } catch (e) {
      next(e);
    }
  };

  public getActivities = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { schedule_id } = activityParams.parse(req.params);
      const { page, limit } = req.pagination;

      const activities = await db
        .selectFrom("activity")
        .where("activity.schedule_id", "=", schedule_id)
        .limit(limit)
        .offset(page * limit)
        .selectAll()
        .execute();

      res.status(200).json(activities);
    } catch (e) {
      next(e);
    }
  };
}

export const activityController = new ActivityController();
