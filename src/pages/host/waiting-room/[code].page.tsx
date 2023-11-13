import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pusher } from "~/utils/pusher";
import { BackButton } from "~/components/BackButton";
import { PlayerCard } from "~/components/PlayerCard";
import toast from "react-hot-toast";
import BaseHead from "~/components/BaseHead";
import { api } from "~/utils/api";

type Player = {
  name: string;
  uid: string;
};

const WaitingRoom = () => {
  const router = useRouter();
  const code = router.query.code as string;

  const [players, setPlayers] = useState<Player[]>([]);

  const getInitialPlayers = api.player.getAll.useQuery(
    {
      roomCode: code,
    },
    {
      enabled: !!code,
    },
  );

  useEffect(() => {
    if (!code) return;
    const channel = pusher.subscribe(code);
    channel.bind(
      "room-join",
      (data: { message: string; sender: string; senderUid: string }) => {
        const checkIfPlayerAlreadyExists = players.find(
          (p) => p.uid === data.senderUid,
        );
        if (!!checkIfPlayerAlreadyExists) return;
        toast.success(`${data.sender} has joined the room!`);
        setPlayers((prev) => [
          ...prev,
          {
            name: data.sender,
            uid: data.senderUid,
          },
        ]);
      },
    );
    return () => pusher.unsubscribe(code);
  }, [code, players]);

  useEffect(() => {
    if (!getInitialPlayers.data) return;
    const players = getInitialPlayers.data.map((player) => {
      return {
        name: player.name ?? "Anonymous",
        uid: player.uid,
      } satisfies Player;
    }) satisfies Player[];
    setPlayers(players);
  }, [getInitialPlayers.data]);

  // TODO: replace this with spinner component
  if (getInitialPlayers.isLoading) return <p>Loading...</p>;

  return (
    <>
      <BaseHead title={`UNO - Room Code: ${code}`} />

      <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-10 text-4xl font-bold">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 text-center">
          <div className="flex w-full justify-start">
            <BackButton />
          </div>
          <h1>Everyone Join!</h1>
          <h2 className="text-2xl font-normal">Room Code is {code}</h2>
          <div className="flex w-full flex-wrap items-center justify-center gap-4 py-4">
            {/* TODO make this actually get players that are connected */}
            {players.length ? (
              <>
                {players.map((player) => {
                  return <PlayerCard name={player.name} key={player.uid} />;
                })}
              </>
            ) : (
              <p className="text-lg font-normal">
                No players have joined so far.
              </p>
            )}
          </div>
          {/* TODO make this redirect us over to the play page */}
          <button className="btn btn-primary">Everyone In?</button>
        </div>
      </div>
    </>
  );
};

export default WaitingRoom;
