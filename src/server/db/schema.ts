import {
  index,
  timestamp,
  varchar,
  mysqlEnum,
  mysqlTable,
} from "drizzle-orm/mysql-core";

import { relations, sql } from "drizzle-orm";

import { CARD_TYPES } from "~/constants/cardTypes";
import { NUMBERS } from "~/constants/nums";
import { COLORS } from "~/constants/colors";
import { STATUSES } from "~/constants/dbEnums/Rooms/status";

export const Room = mysqlTable(
  "Rooms",
  {
    uid: varchar("uid", { length: 255 }).notNull().unique(),
    code: varchar("code", { length: 4 }).unique(),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deletedAt"),
    status: mysqlEnum("status", STATUSES),
  },
  (table) => {
    return {
      code: index("code").on(table.code),
      uid: index("uid").on(table.uid),
    };
  },
);

export const Player = mysqlTable(
  "Players",
  {
    uid: varchar("uid", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    roomCode: varchar("roomCode", { length: 4 }).notNull(),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deletedAt"),
  },
  (table) => {
    return {
      roomCode: index("roomCode").on(table.roomCode),
      uid: index("uid").on(table.uid),
    };
  },
);

export const Card = mysqlTable(
  "Cards",
  {
    uid: varchar("uid", { length: 255 }).notNull().unique(),
    color: mysqlEnum("color", COLORS),
    type: mysqlEnum("type", CARD_TYPES),
    numberValue: mysqlEnum("numberValue", NUMBERS),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deletedAt"),
    roomUid: varchar("roomUid", { length: 255 }).notNull(),
    playerUid: varchar("playerUid", { length: 255 }),
  },
  (table) => {
    return {
      uid: index("uid").on(table.uid),
      roomUid: index("roomUid").on(table.roomUid),
    };
  },
);

export const cardRelations = relations(Card, ({ one }) => ({
  room: one(Room, {
    fields: [Card.roomUid],
    references: [Room.uid],
  }),
  player: one(Player, {
    fields: [Card.playerUid],
    references: [Player.uid],
  }),
}));

export const roomRelations = relations(Room, ({ many }) => ({
  players: many(Player),
  cards: many(Card),
}));

export const playerRelations = relations(Player, ({ one, many }) => ({
  room: one(Room, {
    fields: [Player.roomCode],
    references: [Room.code],
  }),
  cards: many(Card),
}));
