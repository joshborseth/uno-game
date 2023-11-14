import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import BaseHead from "~/components/BaseHead";
import { type PresenceChannel } from "pusher-js";
import toast from "react-hot-toast";
import { type PusherMember } from "~/types/PusherMember";
import { PlayerCard } from "~/components/PlayerCard";
import { getPusherInstance } from "~/utils/pusher";
import { api } from "~/utils/api";

import Spinner from "~/components/Spinner";

const WaitingRoom = () => {
  const router = useRouter();
  const code = router.query.code as string;
  const name = router.query.name as string;
  const userId = router.query.userId as string;
  // subscribe users to the channel

  const [players, setPlayers] = useState<PusherMember[]>([]);

  useEffect(() => {
    if (!code || !name || !userId) return;

    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;
    channel.bind("pusher:subscription_succeeded", () => {
      toast.success("Connection Established", {
        id: "connection-established",
      });
    });
    channel.bind("pusher:subscription_error", () => {
      toast.error("There was an error establishing your connection", {
        id: "connection-error",
      });
    });
    // when new users enter
    channel.bind("pusher:member_added", (members: PusherMember) => {
      setPlayers((prev) => [...prev, members]);
    });

    //when users leave
    channel.bind("pusher:member_removed", (members: PusherMember) => {
      setPlayers((prev) => [
        ...prev.filter((player) => player.id !== members.id),
      ]);
    });

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code, name, userId]);

  const startGameMutation = api.room.startGame.useMutation({
    onSuccess: () => {
      toast.success("Game Started!");
      void router.push({
        pathname: `/host/play/${code}`,
        query: {
          userId: userId,
          name: name,
        },
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <BaseHead title={`UNO - Room Code: ${code || "Loading..."}`} />
      <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-10 text-4xl font-bold">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 text-center">
          <h1>Everyone Join!</h1>
          <h2 className="text-2xl font-normal">
            Room Code is:{" "}
            <span className="text-primary block font-extrabold"> {code}</span>
          </h2>
          <div className="flex w-full flex-wrap items-center justify-center gap-4 py-4">
            {players.map((p) => (
              <PlayerCard name={p.info.name} key={p.id} />
            ))}
          </div>
          {/* TODO make this redirect us over to the play page */}
          <button
            onClick={() => {
              startGameMutation.mutate({
                code: code,
                playerUids: players.map((p) => p.id),
              });
            }}
            className="btn btn-primary"
          >
            Everyone In?
            {startGameMutation.isLoading && <Spinner size="sm" />}
          </button>
        </div>
      </main>
    </>
  );
};

export default WaitingRoom;
