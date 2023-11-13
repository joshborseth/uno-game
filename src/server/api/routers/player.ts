import { eq } from "drizzle-orm";
import { Player } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
export const playerRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        roomCode: z.string().length(4),
      }),
    )
    .query(async ({ ctx, input }) => {
      const players = await ctx.db.query.Player.findMany({
        where: eq(Player.roomCode, input.roomCode),
      });
      return players;
    }),
});
