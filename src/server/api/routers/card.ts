import { type CARD_TYPES } from "~/constants/cardTypes";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { Card, Player, Room } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { pusher } from "~/server/pusher";
import { db } from "~/server/db";
import { map } from "radash";
import { COLORS } from "~/constants/colors";
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

  chooseColor: publicProcedure
    .input(
      z.object({
        code: z.string(),
        color: z.enum(COLORS),
        playerUid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.query.Room.findFirst({
        where: eq(Room.code, input.code),
        with: {
          cards: {
            where: and(eq(Card.isCardToMatch, true)),
            with: {
              player: true,
            },
          },
          players: true,
        },
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }
      const cardToMatch = room.cards[0];
      if (room.cards.length > 1 || !cardToMatch) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong finding card",
        });
      }

      await ctx.db
        .update(Card)
        .set({
          wildColor: input.color,
        })
        .where(eq(Card.uid, cardToMatch.uid));

      await pusher.trigger(`presence-${room.code}`, "color-chosen", {
        message: "Color Chosen",
        card: cardToMatch,
        color: input.color,
      });

      const nextPlayer = await findNextPlayer({
        allPlayersInRoom: room.players!,
        cardType: cardToMatch.type!,
        player: cardToMatch.player!,
        roomCode: room.code!,
      });
      await switchTurn({
        roomCode: room.code!,
        cardType: cardToMatch.type,
      });
      await issueCardsToNextPlayer({
        cardType: cardToMatch.type!,
        nextPlayer: nextPlayer,
        roomCode: room.code!,
      });

      await ctx.db
        .update(Card)
        .set({
          playerUid: null,
        })
        .where(eq(Card.uid, cardToMatch.uid));

      return;
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

      if (!card.player?.isPlayersTurn) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "It is not your turn",
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

        return await ctx.db.query.Card.findFirst({
          where: eq(Card.uid, card.uid),
        });
      };

      if (!card.type) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Card type not found.",
        });
      }

      if (card.type === "wild" || card.type === "draw4") {
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

        const result = await ctx.db.query.Card.findFirst({
          where: eq(Card.uid, card.uid),
        });

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

          if (!card.room.code) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Room code not found. This should never happen.",
            });
          }
          await switchTurn({ roomCode: card.room.code, cardType: card.type });
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

          if (card.type === "draw2") {
            if (!card.room.code || !card.player) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Room code or player not found. This should never happen.",
              });
            }

            const findAllPlayers = await ctx.db.query.Player.findMany({
              where: eq(Player.roomCode, card.room.code),
            });

            if (!findAllPlayers.length) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Players not found",
              });
            }

            const nextPlayer = await findNextPlayer({
              allPlayersInRoom: findAllPlayers,
              cardType: card.type,
              player: card.player,
              roomCode: card.room.code,
            });
            await switchTurn({
              cardType: card.type,
              roomCode: card.room.code,
            });
            const cards = await issueCardsToNextPlayer({
              cardType: card.type,
              nextPlayer: nextPlayer,
              roomCode: card.room.code,
            });
            await pusher.trigger(`presence-${card.room.code}`, "cards-issued", {
              player: nextPlayer,
              cards,
            });
          }

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
  drawCardAndSurrenderTurn: publicProcedure
    .input(
      z.object({
        playerUid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const player = await ctx.db.query.Player.findFirst({
        where: eq(Player.uid, input.playerUid),
        with: {
          room: true,
          cards: true,
        },
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found, cannot draw card.",
        });
      }

      const randomCard = await ctx.db.query.Card.findFirst({
        where: and(isNull(Card.playerUid), eq(Card.isCardToMatch, false)),
        orderBy: sql`rand()`,
      });

      if (!randomCard) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find random card.",
        });
      }

      await ctx.db
        .update(Card)
        .set({
          playerUid: player.uid,
        })
        .where(eq(Card.uid, randomCard.uid));

      if (!player.roomCode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Player does not have a room code. This should never happen.",
        });
      }
      await switchTurn({ roomCode: player.roomCode, cardType: null });
    }),
});

const switchTurn = async ({
  roomCode,
  cardType,
}: {
  roomCode: string;
  cardType: (typeof CARD_TYPES)[number] | null;
}) => {
  const player = await db.query.Player.findFirst({
    where: and(eq(Player.roomCode, roomCode), eq(Player.isPlayersTurn, true)),
  });

  if (!player) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Player not found",
    });
  }

  if (player.order === null) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Player order is null so we dont know who's turn it should be. this should never happen",
    });
  }

  const allPlayersInRoom = await db.query.Player.findMany({
    where: eq(Player.roomCode, roomCode),
    orderBy: asc(Player.order),
  });

  if (!allPlayersInRoom.length) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No players in room were found",
    });
  }

  //update so that it is no longer the players turn
  await db
    .update(Player)
    .set({
      isPlayersTurn: false,
    })
    .where(eq(Player.uid, player.uid));

  if (cardType === "reverse") {
    const room = await db.query.Room.findFirst({
      where: eq(Room.code, roomCode),
    });

    if (!room) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Room not found",
      });
    }

    if (room.orderStatus === "reverse") {
      await db
        .update(Room)
        .set({
          orderStatus: "normal",
        })
        .where(eq(Room.code, roomCode));
    } else {
      await db
        .update(Room)
        .set({
          orderStatus: "reverse",
        })
        .where(eq(Room.code, roomCode));
    }
  }

  if (!cardType) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Card type is null",
    });
  }
  const nextPlayer = await findNextPlayer({
    allPlayersInRoom: allPlayersInRoom,
    player: player,
    cardType: cardType,
    roomCode: roomCode,
  });

  if (!nextPlayer) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Could not find next player",
    });
  }
  await db
    .update(Player)
    .set({
      isPlayersTurn: true,
    })
    .where(eq(Player.uid, nextPlayer.uid));

  const updatedPlayer = await db.query.Player.findFirst({
    where: and(eq(Player.isPlayersTurn, true), eq(Player.roomCode, roomCode)),
  });

  const response = {
    message: "Turn Switched",
    newPlayer: updatedPlayer,
    oldPlayer: player,
  };

  await pusher.trigger(`presence-${roomCode}`, "turn-changed", response);

  return response;
};

const findNextPlayer = async ({
  allPlayersInRoom,
  player,
  roomCode,
  cardType,
}: {
  allPlayersInRoom: (typeof Player.$inferSelect)[];
  player: typeof Player.$inferSelect;
  roomCode: string;
  cardType: (typeof CARD_TYPES)[number];
}) => {
  if (!allPlayersInRoom.length || !player?.order) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Something went wrong",
    });
  }

  const updatedRoom = await db.query.Room.findFirst({
    where: eq(Room.code, roomCode),
  });

  if (!updatedRoom) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Room not found",
    });
  }

  let findNextPlayer: typeof Player.$inferSelect | undefined;
  if (updatedRoom.orderStatus === "reverse") {
    if (cardType === "skip") {
      findNextPlayer =
        player.order === 0
          ? await db.query.Player.findFirst({
              where: and(
                eq(Player.roomCode, roomCode),
                eq(Player.order, allPlayersInRoom.length - 2),
              ),
            })
          : await db.query.Player.findFirst({
              where: and(
                eq(Player.roomCode, roomCode),
                eq(Player.order, player.order - 2),
              ),
            });
    } else {
      findNextPlayer =
        player.order === 0
          ? await db.query.Player.findFirst({
              where: and(
                eq(Player.roomCode, roomCode),
                eq(Player.order, allPlayersInRoom.length - 1),
              ),
            })
          : await db.query.Player.findFirst({
              where: and(
                eq(Player.roomCode, roomCode),
                eq(Player.order, player.order - 1),
              ),
            });
    }
  } else {
    if (cardType === "skip") {
      findNextPlayer =
        allPlayersInRoom.length === player.order - 1 //if they are at the end of the order of the users
          ? await db.query.Player.findFirst({
              where: and(eq(Player.roomCode, roomCode), eq(Player.order, 1)),
            })
          : await db.query.Player.findFirst({
              where: and(
                eq(Player.roomCode, roomCode),
                eq(Player.order, player.order + 2),
              ),
            });
    } else {
      findNextPlayer =
        allPlayersInRoom.length === player.order - 1
          ? await db.query.Player.findFirst({
              where: and(eq(Player.roomCode, roomCode), eq(Player.order, 0)),
            })
          : await db.query.Player.findFirst({
              where: and(
                eq(Player.roomCode, roomCode),
                eq(Player.order, player.order + 1),
              ),
            });
    }
  }

  if (!findNextPlayer) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Could not find next player",
    });
  }

  return findNextPlayer;
};

const issueCardsToNextPlayer = async ({
  nextPlayer,
  cardType,
  roomCode,
}: {
  nextPlayer: typeof Player.$inferSelect;
  cardType: (typeof CARD_TYPES)[number];
  roomCode: string;
}) => {
  const getRandomCards = async (limit: number) => {
    return await db.query.Card.findMany({
      where: and(
        eq(Card.roomUid, roomCode),
        isNull(Card.playerUid),
        eq(Card.isCardToMatch, false),
      ),
      orderBy: sql`rand()`,
      limit: limit,
    });
  };

  if (cardType === "draw2") {
    const randomCards = await getRandomCards(2);
    await map(randomCards, async (card) => {
      await db
        .update(Card)
        .set({
          playerUid: nextPlayer.uid,
        })
        .where(eq(Card.uid, card.uid));
    });

    return randomCards;
  }
  if (cardType === "draw4") {
    const randomCards = await getRandomCards(4);
    await map(randomCards, async (card) => {
      await db
        .update(Card)
        .set({
          playerUid: nextPlayer.uid,
        })
        .where(eq(Card.uid, card.uid));
    });

    return randomCards;
  }
};
