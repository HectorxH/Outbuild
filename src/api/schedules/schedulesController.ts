import { NextFunction, Request, Response } from "express";
import {
  scheduleGetParam,
  schedulePostBody,
  ScheduleResponse,
} from "./schedulesModel";
import { validateBody, validateParams } from "../../common/utils/validation";
import { scheduleService } from "./scheduleService";

class ScheduleController {
  public createEmptySchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, url } = await validateBody(schedulePostBody, req.body);
      const { id } = req.auth;

      const schedule = await scheduleService.createSchedule({
        name,
        url,
        user_id: id,
      });

      const response: ScheduleResponse = { data: schedule };
      res.status(200).json(response);
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
      const { schedule_id } = await validateParams(
        scheduleGetParam,
        req.params,
      );

      const schedule = await scheduleService.getScheduleById(schedule_id);

      const response: ScheduleResponse = { data: schedule };
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };
}

export const scheduleController = new ScheduleController();
