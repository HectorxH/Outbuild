import * as jwt from "jsonwebtoken";

export const apiConfig = {
  host: process.env.HOST || "localhost",
  port: process.env.PORT || "8000",
};

export const dbConfig = {
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || "5432",
  database: process.env.PG_DB || "outbuild",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASS || "postgres",
};

// Algorithm type needs to be more specific than the infered
// type of 'string'.
export const jwtConfig: {
  secret: string;
  algorithm: jwt.Algorithm;
  expireTime: string;
} = {
  secret: process.env.JWT_ACCESS_SECRET || "sample_secret_token",
  algorithm: "HS256",
  expireTime: process.env.JWT_EXPIRE_TIME || "1h",
};
