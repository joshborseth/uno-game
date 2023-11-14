import { createTRPCRouter } from "~/server/api/trpc";
import { roomRouter } from "./routers/room";
import { playerRouter } from "./routers/player";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  room: roomRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
