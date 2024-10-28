import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  outbuild_user: OutbuildUserTable;
  schedule: ScheduleTable;
  activity: ActivityTable;
}

export interface OutbuildUserTable {
  id: Generated<number>;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type OutbuildUser = Selectable<OutbuildUserTable>;
export type NewOutbuildUser = Insertable<OutbuildUserTable>;
export type OutbuildUserUpdate = Updateable<OutbuildUserTable>;

export interface ScheduleTable {
  id: Generated<number>;
  name: string;
  url: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type Schedule = Selectable<ScheduleTable>;
export type NewSchedule = Insertable<ScheduleTable>;
export type ScheduleUpdate = Updateable<ScheduleTable>;

export interface ActivityTable {
  id: Generated<number>;
  name: string;
  start_date: Date;
  end_date: Date;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type Activity = Selectable<ActivityTable>;
export type NewActivity = Insertable<ActivityTable>;
export type ActivityUpdate = Updateable<ActivityTable>;
