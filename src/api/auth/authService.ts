import { StatusCodes } from "http-status-codes";
import { logger } from "../../app";
import { db } from "../../common/db/db";
import { NewOutbuildUser } from "../../common/db/types";
import { OutbuildApiError } from "../../common/models/error";

class AuthService {
  public createUser = async (newUser: NewOutbuildUser) => {
    try {
      const user = await db
        .insertInto("outbuild_user")
        .values(newUser)
        .returning("id")
        .executeTakeFirstOrThrow();

      return user;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while inserting new user into the DB.",
      );
    }
  };

  public findUserByEmail = async (email: string) => {
    try {
      const user = await db
        .selectFrom("outbuild_user")
        .where("outbuild_user.email", "=", email)
        .selectAll()
        .executeTakeFirstOrThrow();

      return user;
    } catch (e) {
      logger.error(e);
      throw new OutbuildApiError(
        "ServiceError",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error while finding user by email on the DB.",
      );
    }
  };
}
export const authService = new AuthService();
