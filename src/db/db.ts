import { Database } from "./types";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

const host = "localhost";
const port = "5432";
const database = "outbuild";
const user = process.env.PG_USER || "postgres";
const password = process.env.PG_PASS || "postgres";

const dialect = new PostgresDialect({
  pool: new Pool({
    host,
    port: parseInt(port),
    database,
    user,
    password,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
