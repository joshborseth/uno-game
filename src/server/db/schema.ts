import {
  index,
  timestamp,
  varchar,
  mysqlEnum,
  mysqlTable,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

import { relations, sql } from "drizzle-orm";

import { CARD_TYPES } from "~/constants/cardTypes";
import { NUMBERS } from "~/constants/nums";
import { COLORS } from "~/constants/colors";
import { STATUSES } from "~/constants/dbEnums/Rooms/status";

export const Room = mysqlTable(
  "Rooms",
  {
    uid: varchar("uid", { length: 255 }).notNull().unique().primaryKey(),
    code: varchar("code", { length: 4 }).unique(),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deletedAt"),
    status: mysqlEnum("status", STATUSES),
    orderStatus: mysqlEnum("orderStatus", ["normal", "reverse"]).default(
      "normal",
    ),
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
    uid: varchar("uid", { length: 255 }).notNull().unique().primaryKey(),
    name: varchar("name", { length: 255 }),
    roomCode: varchar("roomCode", { length: 4 }).notNull(),
    createdAt: timestamp("createdAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deletedAt"),
    isPlayersTurn: boolean("isPlayersTurn").default(false),
    order: int("order").default(0),
  },
  (table) => {
    return {
      roomCode: index("roomCode").on(table.roomCode),
      uid: index("uid").on(table.uid),
      isPlayersTurn: index("isPlayersTurn").on(table.isPlayersTurn),
    };
  },
);

export const Card = mysqlTable(
  "Cards",
  {
    uid: varchar("uid", { length: 255 }).notNull().unique().primaryKey(),
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
    isCardToMatch: boolean("isCardToMatch").default(false),
    //we really could just store this in the color column
    //might want to switch to that in the future
    //wasnt thinking when this was first implemented
    wildColor: mysqlEnum("wildColor", COLORS),
  },
  (table) => {
    return {
      uid: index("uid").on(table.uid),
      roomUid: index("roomUid").on(table.roomUid),
      isCardToMatch: index("isCardToMatch").on(table.isCardToMatch),
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
