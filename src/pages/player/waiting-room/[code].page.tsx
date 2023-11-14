import Link from "next/link";
import { useRouter } from "next/router";
import { type PresenceChannel } from "pusher-js";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getPusherInstance } from "~/utils/pusher";

const WaitingRoom = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const name = router.query.name as string;
  const userId = router.query.userId as string;

  // subscribe users to the channel
  useEffect(() => {
    if (!code || !name || !userId) return;

    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
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
  }, [code, name, userId]);
  if (!code || !name || !userId) return router.push("/");
  return (
    <main className="flex h-screen w-screen flex-wrap items-center justify-center">
      <h1 className="text-5xl">Sit Tight!</h1>
      <h2 className="w-full text-center text-4xl">
        Your Name: <span className="text-primary">{name}</span>
      </h2>
      <Link href="/">Change Name?</Link>
    </main>
  );
};

export default WaitingRoom;
