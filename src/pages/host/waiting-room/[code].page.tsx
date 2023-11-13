import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BackButton } from "~/components/BackButton";

import BaseHead from "~/components/BaseHead";
import { type PresenceChannel } from "pusher-js";
import toast from "react-hot-toast";
import { type PusherMemberAdded } from "~/types/PusherMemberAdded";
import { PlayerCard } from "~/components/PlayerCard";
import { getPusherInstance } from "~/utils/pusher";

const WaitingRoom = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const name = router.query.name as string;
  const userId = router.query.userId as string;
  // subscribe users to the channel

  const [players, setPlayers] = useState<PusherMemberAdded[]>([]);

  useEffect(() => {
    if (!code || !name || !userId) return;

    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;
    channel.bind("pusher:subscription_succeeded", () => {
      toast.success("Connection Established");
    });
    channel.bind("pusher:subscription_error", () => {
      toast.error("There was an error establishing your connection");
    });
    // when new users enter
    channel.bind("pusher:member_added", (members: PusherMemberAdded) => {
      setPlayers((prev) => [...prev, members]);
    });

    channel.bind("pushed:member_removed", (members: PusherMemberAdded) => {
      setPlayers((prev) => [
        ...prev.filter((player) => player.id !== members.id),
      ]);
    });

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code, name, userId]);
  return (
    <>
      <BaseHead title={`UNO - Room Code: ${code || "Loading..."}`} />
      <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-10 text-4xl font-bold">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 text-center">
          <div className="flex w-full justify-start">
            <BackButton />
          </div>
          <h1>Everyone Join!</h1>
          <h2 className="text-2xl font-normal">Room Code is {code}</h2>
          <div className="flex w-full flex-wrap items-center justify-center gap-4 py-4">
            {players.map((p) => (
              <PlayerCard name={p.info.name} key={p.id} />
            ))}
          </div>
          {/* TODO make this redirect us over to the play page */}
          <button className="btn btn-primary">Everyone In?</button>
        </div>
      </div>
    </>
  );
};

export default WaitingRoom;
