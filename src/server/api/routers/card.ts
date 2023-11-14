import { and, eq, isNull } from "drizzle-orm";
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
  drawFirst: publicProcedure
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

      const cardToMatch = await ctx.db.query.Card.findFirst({
        where: and(
          eq(Card.roomUid, room.uid),
          isNull(Card.playerUid),
          eq(Card.isCardToMatch, true),
        ),
      });

      if (!cardToMatch) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Card to match not found. Oof this is bad...",
        });
      }

      await ctx.db
        .update(Card)
        .set({
          isCardToMatch: true,
        })
        .where(eq(Card.uid, cardToMatch.uid));

      await pusher.trigger(`presence-${input.code}`, "initial-card-drawn", {
        message: "Initial Card Drawn",
        card: cardToMatch,
      });

      return cardToMatch;
    }),
  playCard: publicProcedure
    .input(
      z.object({
        cardUid: z.string(),
        playerUid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const card = await ctx.db.query.Card.findFirst({
        where: and(
          eq(Card.uid, input.cardUid),
          eq(Card.playerUid, input.playerUid),
        ),
        with: {
          room: true,
          player: true,
        },
      });

      if (!card) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Card not found",
        });
      }

      const cardToMatch = await ctx.db.query.Card.findFirst({
        where: and(
          eq(Card.roomUid, card.roomUid),
          eq(Card.isCardToMatch, true),
        ),
      });

      if (!cardToMatch) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Card to match not found. Oof this is bad... This should never happen...",
        });
      }

      const playCard = async () => {
        await ctx.db
          .update(Card)
          .set({
            playerUid: null,
            isCardToMatch: true,
          })
          .where(eq(Card.uid, card.uid));

        await ctx.db
          .update(Card)
          .set({
            isCardToMatch: false,
          })
          .where(eq(Card.uid, cardToMatch.uid));

        return card;
      };

      if (!card.type) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Card type not found.",
        });
      }

      if (card.type === "wild" || card.type === "draw4") {
        const result = await playCard();

        const response = {
          message: "Card Played",
          card: result,
          player: card.player,
          room: card.room,
        };

        await pusher.trigger(
          `presence-${card.room.code}`,
          "card-played",
          response,
        );

        return response;
      }

      if (card.type === "number") {
        if (
          card.numberValue === cardToMatch.numberValue ||
          card.color === cardToMatch.color
        ) {
          const result = await playCard();

          const response = {
            message: "Card Played",
            card: result,
            player: card.player,
            room: card.room,
          };

          await pusher.trigger(
            `presence-${card.room.code}`,
            "card-played",
            response,
          );

          return response;
        } else {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Card does not match.",
          });
        }
      }

      if (
        card.type === "skip" ||
        card.type === "reverse" ||
        card.type === "draw2"
      ) {
        if (
          card.type === cardToMatch.type ||
          card.color === cardToMatch.color
        ) {
          const result = await playCard();

          const response = {
            message: "Card Played",
            card: result,
            player: card.player,
            room: card.room,
          };

          await pusher.trigger(
            `presence-${card.room.code}`,
            "card-played",
            response,
          );

          return response;
        } else {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Card does not match.",
          });
        }
      }
    }),
});
