import { eq } from "drizzle-orm";
import { Player, Room } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { fourRandomLetters } from "../../helpers/roomCodeGen";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
export const roomRouter = createTRPCRouter({
  create: publicProcedure.mutation(async ({ ctx }) => {
    const generateUniqueCode = async (): Promise<string> => {
      const code = fourRandomLetters();
      const rooms = await ctx.db.select().from(Room).where(eq(Room.code, code));
      if (rooms.length > 0) {
        return await generateUniqueCode();
      }
      return code;
    };
    const code = await generateUniqueCode();
    const uid = nanoid();
    await ctx.db.insert(Room).values({
      code,
      uid,
      status: "waiting",
    });

    return code;
  }),
  join: publicProcedure
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.code.length !== 4) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Name must be 4 characters long",
        });
      }

      const room = await ctx.db.query.Room.findFirst({
        where: eq(Room.code, input.code),
      });
      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }
      if (room.status !== "waiting") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Room is not joinable because the game is either in progress or already completed.",
        });
      }

      const uid = nanoid();
      await ctx.db.insert(Player).values({
        name: input.name,
        roomCode: input.code,
        uid,
      });

      return {
        code: input.code,
        uid,
        name: input.name,
      };
    }),

  markRoomAsFinished: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.query.Room.findFirst({
        where: eq(Room.code, input.code),
      });
      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Room not found",
        });
      }
      return await ctx.db
        .update(Room)
        .set({
          status: "finished",
        })
        .where(eq(Room.code, input.code));
    }),
});
