import { useRouter } from "next/router";
import { type PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BaseHead from "~/components/BaseHead";
import { type CardProps } from "~/components/Card";
import CardHand from "~/components/CardHand";
import PickupCard from "~/components/PickupCard";
import { api } from "~/utils/api";
import { getPusherInstance } from "~/utils/pusher";

const Play = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const code = router.query.code as string;
  const name = router.query.name as string;
  const [isMyTurn, setIsMyTurn] = useState(false);

  const getInitialCards = api.card.retrieveAllForCurrentPlayer.useQuery(
    {
      playerUid: userId,
    },
    {
      enabled: !!userId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  const getAllPlayers = api.player.getAll.useQuery(
    {
      code,
    },
    {
      enabled: !!code,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    if (!code || !name || !userId) return;
    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;

    channel.bind("turn-changed", () => {
      setIsMyTurn(true);
    });

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code, name, userId]);

  return (
    <>
      <BaseHead title="UNO - Player" />
      <main className="flex min-h-screen w-full flex-col flex-wrap items-center justify-between">
        <div className="w-32" />
        <button
          onClick={() => {
            setIsMyTurn(!isMyTurn);
          }}
        >
          change turn test btn
        </button>
        <PickupCard />
        {getInitialCards.data?.length && (
          <CardHand
            disabled={!isMyTurn}
            playersInLobby={getAllPlayers.data?.map((p) => p.name) ?? []}
            cardArr={getInitialCards.data.map((c) => {
              return {
                type: c.type ?? "number",
                color: c.color ?? "red",
                key: c.uid,
                num: c.numberValue ?? "0",
              } satisfies CardProps;
            })}
          />
        )}
      </main>
    </>
  );
};

export default Play;
