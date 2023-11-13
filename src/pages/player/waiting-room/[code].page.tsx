import { useRouter } from "next/router";
import { type PresenceChannel } from "pusher-js";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { pusher } from "~/utils/pusher";

const WaitingRoom = () => {
  const router = useRouter();
  const code = router.query.code as string;

  // subscribe users to the channel
  useEffect(() => {
    if (!code) return;

    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;
    channel.bind("pusher:subscription_succeeded", () => {
      toast.success("You have joined the room!");
    });
    channel.bind("pusher:subscription_error", () => {
      toast.error("There was an error creating your room:");
    });

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code]);

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-5xl">Sit Tight!</h1>
    </main>
  );
};

export default WaitingRoom;
