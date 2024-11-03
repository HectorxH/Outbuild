import { StatusCodes } from "http-status-codes";
import { logger } from "../../app";
import { db } from "../../common/db/db";
import { NewActivity } from "../../common/db/types";
import { OutbuildApiError } from "../../common/models/error";

class ActivityService {
  public createActivities = async (newActivities: NewActivity[]) => {
    try {
      const activities = await db
        .insertInto("activity")
        .values(newActivities)
        .returningAll()
        .execute();

      return activities;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while inserting new activity into the Activities table.",
      );
    }
  };

  public getActivities = async (
    schedule_id: number,
    page: number,
    limit: number,
  ) => {
    try {
      const activities = await db
        .selectFrom("activity")
        .where("activity.schedule_id", "=", schedule_id)
        .limit(limit)
        .offset(page * limit)
        .selectAll()
        .execute();
      return activities;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while finding activity in the Activities table.",
      );
    }
  };
}

export const activityService = new ActivityService();
