/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("outbuild_user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("schedule")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("owner_id", "integer", (col) =>
      col.references("outbuild_user.id").onDelete("cascade").notNull(),
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("url", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable("activity")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("schedule_id", "integer", (col) =>
      col.references("schedule.id").onDelete("cascade").notNull(),
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("start_date", "timestamp", (col) => col.notNull())
    .addColumn("end_date", "timestamp", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("outbuild_user").execute();
  await db.schema.dropTable("schedule").execute();
  await db.schema.dropTable("activity").execute();
}
