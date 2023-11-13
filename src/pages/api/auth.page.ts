import type { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../server/pusher";
import { nanoid } from "nanoid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  const socketId = req.body.socket_id as string;
  const channel = req.body.channel_name as string;
  const presenceData = {
    user_id: nanoid(),
    user_info: { name: req.body.user_name },
  };
  const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
  return res.send(authResponse);
}
