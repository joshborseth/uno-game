import Pusher from "pusher-js";
import { env } from "~/env.mjs";

export const getPusherInstance = ({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) => {
  return new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: "/api/auth",
    auth: {
      params: {
        user_name: userName,
        userId: userId,
      },
    },
    forceTLS: true,
  });
};
