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
      <main className="flex min-h-screen w-full flex-col items-center justify-end gap-12 pb-20">
        <div className="flex flex-col items-center justify-center gap-10">
          <h2 className="text-2xl font-bold">Card To Match:</h2>
          <CardToMatch card={cardToMatch} />
        </div>

        <div className="flex w-full justify-center">
          {!!getAllPlayers?.data?.length &&
            getAllPlayers.data.map((player) => (
              <div className="w-[10%] py-4" key={player.uid}>
                <PlayerCard
                  name={player.name ?? ""}
                  cardsLeft={player.cards.length}
                />
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Play;

export const Title = () => {
  return (
    <h1 className="text-primary text-7xl font-bold uppercase underline underline-offset-4">
      Uno
    </h1>
  );
};
