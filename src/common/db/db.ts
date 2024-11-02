import { Database } from "./types";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { dbConfig } from "../utils/configs";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: dbConfig.host,
    port: parseInt(dbConfig.port),
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
