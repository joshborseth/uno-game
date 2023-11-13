import type { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../server/pusher";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socketId = req.body.socket_id as string;
  const channel = req.body.channel_name as string;
  const presenceData = {
    user_id: req.body.userId,
    user_info: { name: req.body.user_name },
  };
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  return res.send(authResponse);
}
