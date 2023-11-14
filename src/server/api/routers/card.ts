import { and, eq, isNull, sql } from "drizzle-orm";
import { Card, Room } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { pusher } from "~/server/pusher";
export const cardRouter = createTRPCRouter({
  retrieveAllForCurrentPlayer: publicProcedure
    .input(
      z.object({
        playerUid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cards = await ctx.db.query.Card.findMany({
        where: eq(Card.playerUid, input.playerUid),
      });
      if (!cards) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cards not found",
        });
      }

      return cards;
    }),
  drawRandom: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.query.Room.findFirst({
        where: eq(Room.code, input.code),
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }

      const randomCard = await ctx.db.query.Card.findFirst({
        orderBy: sql`rand()`,
        where: and(eq(Card.roomUid, room.uid), isNull(Card.playerUid)),
      });

      if (!randomCard) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Card not found",
        });
      }

      await pusher.trigger(`presence-${input.code}`, "initial-card-drawn", {
        message: "Initial Card Drawn",
        card: randomCard,
      });

      return randomCard;
    }),
});
