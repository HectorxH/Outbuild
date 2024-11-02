import { NextFunction, Request, Response } from "express";
import z from "zod";

const paginationParams = z.object({
  page: z.number().nonnegative().default(0),
  limit: z.number().positive().default(10),
});
export type PaginationParamas = z.infer<typeof paginationParams>;

const pagination = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationParams.parse(req.params);
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
