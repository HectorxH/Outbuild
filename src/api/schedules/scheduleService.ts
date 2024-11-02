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
        "Error while inserting new user into the DB.",
      );
    }
  };

  public getScheduleById = async (id: number) => {
    try {
      const schedule = await db
        .selectFrom("schedule")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirstOrThrow();
      return schedule;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while inserting new user into the DB.",
      );
    }
  };
}

export const scheduleService = new ScheduleService();
