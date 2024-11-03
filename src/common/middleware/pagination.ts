import { NextFunction, Request, Response } from "express";
import z from "zod";
import { validateParams } from "../utils/validation";

const paginationParams = z.object({
  page: z.coerce.number().nonnegative().default(0),
  limit: z.coerce.number().positive().default(10),
});
export type PaginationParamas = z.infer<typeof paginationParams>;

const pagination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = await validateParams(paginationParams, req.query);
    req.pagination = {
      page,
      limit,
    };
    next();
  } catch (e) {
    next(e);
  }
};

export { paginationParams, pagination };
