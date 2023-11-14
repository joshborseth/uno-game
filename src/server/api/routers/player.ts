import { eq } from "drizzle-orm";
import { Player } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const playerRouter = createTRPCRouter({
  delete: publicProcedure
    .input(
      z.object({
        playerUid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletePlayer = await ctx.db
        .delete(Player)
        .where(eq(Player.uid, input.playerUid));
      return deletePlayer;
    }),
  retrieve: publicProcedure
    .input(
      z.object({
        playerUid: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const player = await ctx.db.query.Player.findFirst({
        where: eq(Player.uid, input.playerUid),
      });
      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      return player;
    }),
});
