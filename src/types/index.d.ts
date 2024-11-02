import "express-serve-static-core";
import { JWTPayload } from "../common/middleware/jwt";
import { PaginationParamas } from "../common/middleware/pagination";
import z from "zod";

declare module "express-serve-static-core" {
  export interface Request {
    auth: JWTPayload;
    pagination: PaginationParamas;
  }
}
