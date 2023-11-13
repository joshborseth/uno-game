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
    });

    return code;
  }),
  join: publicProcedure
    .input(
      z.object({
        code: z.string().length(4),
        name: z.string(),
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
});
