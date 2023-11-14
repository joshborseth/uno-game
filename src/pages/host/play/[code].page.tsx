import { type NextPage } from "next";
import { useRouter } from "next/router";
import BaseHead from "~/components/BaseHead";
import { PlayerCard } from "~/components/PlayerCard";
import { type RouterOutputs, api } from "~/utils/api";
import { type PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { CardToMatch } from "~/components/CardToMatch";
import { getPusherInstance } from "~/utils/pusher";
import Spinner from "~/components/Spinner";
import Link from "next/link";

const Play: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const code = router.query.code as string;
  const name = router.query.name as string;
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

  const getInitialCardToMatch = api.card.drawFirst.useQuery(
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
    if (getInitialCardToMatch.isSuccess) {
      setCardToMatch(getInitialCardToMatch.data);
    }
  }, [getInitialCardToMatch.isSuccess, getInitialCardToMatch.data]);

  useEffect(() => {
    if (!code || !name || !userId) return;

    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;

    channel.bind("card-played", (data: RouterOutputs["card"]["playCard"]) => {
      if (data) {
        setCardToMatch(data.card);
      }
    });

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code, name, userId, getInitialCardToMatch.data]);

  const [cardToMatch, setCardToMatch] =
    useState<typeof getInitialCardToMatch.data>();

  if (!cardToMatch || !getAllPlayers.data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
        <Spinner size="lg" accent />
      </div>
    );
  }

  return (
    <>
      <BaseHead title="UNO - Host" />
      <main className="flex min-h-screen w-full flex-col items-center justify-end gap-20 pb-20">
        <Title />

        <div className="flex flex-col items-center justify-center gap-10">
          <h2 className="text-2xl font-bold">Card To Match:</h2>
          <CardToMatch card={cardToMatch} />
        </div>

        <div className="flex gap-10">
          {!!getAllPlayers?.data?.length &&
            getAllPlayers.data.map((player) => (
              <PlayerCard
                name={player.name ?? ""}
                key={player.uid}
                cardsLeft={player.cards.length}
              />
            ))}
        </div>
        <Link href="../../../winner">End Game</Link>
      </main>
    </>
  );
};

export default Play;

export const Title = () => {
  return <h1 className="text-8xl font-bold uppercase text-black">Uno</h1>;
};
