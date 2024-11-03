import "express-serve-static-core";
import { JWTPayload } from "../common/middleware/jwt";
import { PaginationParamas } from "../common/middleware/pagination";

declare module "express-serve-static-core" {
  export interface Request {
    auth: JWTPayload;
    pagination: PaginationParamas;
  }
}
