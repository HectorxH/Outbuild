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
