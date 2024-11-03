import { StatusCodes } from "http-status-codes";
import { logger } from "../../app";
import { NewSchedule } from "../../common/db/types";
import { OutbuildApiError } from "../../common/models/error";
import { db } from "../../common/db/db";

class ScheduleService {
  public createSchedule = async (newSchedule: NewSchedule) => {
    try {
      const schedule = await db
        .insertInto("schedule")
        .values(newSchedule)
        .returningAll()
        .executeTakeFirstOrThrow();
      return schedule;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while inserting new schedule into the Schedules table.",
      );
    }
  };

  public getScheduleById = async (user_id: number, schedule_id: number) => {
    try {
      const schedule = await db
        .selectFrom("schedule")
        .where("user_id", "=", user_id)
        .where("id", "=", schedule_id)
        .selectAll()
        .executeTakeFirstOrThrow();
      return schedule;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while finding schedule in the Schedules table.",
      );
    }
  };

  public checkScheduleOwnership = async (
    user_id: number,
    schedule_id: number,
  ) => {
    try {
      const schedule = await db
        .selectFrom("schedule")
        .where("user_id", "=", user_id)
        .where("id", "=", schedule_id)
        .selectAll()
        .execute();

      return schedule.length > 0;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while checking if the current user owns the schedule in the Schedules table.",
      );
    }
  };
}

export const scheduleService = new ScheduleService();
