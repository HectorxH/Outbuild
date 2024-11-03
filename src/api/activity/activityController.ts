import { NextFunction, Request, Response } from "express";
import {
  activitiesPostBody,
  ActivitiesResponse,
  activityParams,
  activityPostBody,
  ActivityPostResponse,
} from "./activityModel";
import { validateBody, validateParams } from "../../common/utils/validation";
import { activityService } from "./activityService";
import { scheduleService } from "../schedule/scheduleService";
import { OutbuildApiError } from "../../common/models/error";
import { StatusCodes } from "http-status-codes";

class ActivityController {
  public createActivity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { name, start_date, end_date } = await validateBody(
        activityPostBody,
        req.body,
      );
      const { schedule_id } = await validateParams(activityParams, req.params);
      const { id } = req.auth;

      if (!scheduleService.checkScheduleOwnership(id, schedule_id)) {
        throw new OutbuildApiError(
          "UnauthorizedScheduleAccessError",
          StatusCodes.UNAUTHORIZED,
          `The schedule of id ${schedule_id} does not belong to user id ${id}`,
        );
      }

      const activities = await activityService.createActivities([
        { name, start_date, end_date, schedule_id },
      ]);

      const response: ActivityPostResponse = { data: activities[0] };
      res.status(200).json(response);
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
      const newActivities = await validateBody(activitiesPostBody, req.body);
      const { schedule_id } = await validateParams(activityParams, req.params);
      const { id } = req.auth;

      if (!scheduleService.checkScheduleOwnership(id, schedule_id)) {
        throw new OutbuildApiError(
          "UnauthorizedScheduleAccessError",
          StatusCodes.UNAUTHORIZED,
          `The schedule of id ${schedule_id} does not belong to user id ${id}`,
        );
      }

      const activities = await activityService.createActivities(
        newActivities.map((activity) => ({ ...activity, schedule_id })),
      );

      const response: ActivitiesResponse = { data: activities };
      res.status(200).json(response);
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
      const { schedule_id } = await validateParams(activityParams, req.params);
      const { page, limit } = req.pagination;
      const { id } = req.auth;

      if (!scheduleService.checkScheduleOwnership(id, schedule_id)) {
        throw new OutbuildApiError(
          "UnauthorizedScheduleAccessError",
          StatusCodes.UNAUTHORIZED,
          `The schedule of id ${schedule_id} does not belong to user id ${id}`,
        );
      }

      const activities = await activityService.getActivities(
        schedule_id,
        page,
        limit,
      );

      const response: ActivitiesResponse = { data: activities };
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };
}

export const activityController = new ActivityController();
