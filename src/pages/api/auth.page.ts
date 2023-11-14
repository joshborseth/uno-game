import type { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../server/pusher";
import { rateLimiter } from "~/utils/rateLimiter";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Will Rate Limit to 25 requests per every 5 minutes
  const ratelimit = rateLimiter({ amount: 25, time: "5m" });

  const { success } = await ratelimit.limit(req.body.userId as string);
  if (!success) throw new Error("Too Many Requests");
  const socketId = req.body.socket_id as string;
  const channel = req.body.channel_name as string;
  const presenceData = {
    user_id: req.body.userId,
    user_info: { name: req.body.user_name },
  };
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  return res.send(authResponse);
}
