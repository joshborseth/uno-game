import { type NextPage } from "next";
import { useRouter } from "next/router";
import BaseHead from "~/components/BaseHead";
import { PlayerCard } from "~/components/PlayerCard";
import { api } from "~/utils/api";
import { type PresenceChannel } from "pusher-js";
import { useEffect } from "react";
import { CardToMatch } from "~/components/CardToMatch";
import { getPusherInstance } from "~/utils/pusher";

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
    if (!code || !name || !userId) return;

    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code, name, userId]);

  return (
    <>
      <BaseHead title="UNO - Host" />
      <main className="flex min-h-screen w-full flex-col items-center justify-end gap-20 py-20">
        {getInitialCardToMatch.data && (
          <div className="flex flex-col items-center justify-center gap-10">
            <h2 className="text-2xl font-bold">Card To Match:</h2>
            <CardToMatch card={getInitialCardToMatch.data} />
          </div>
        )}
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
      </main>
    </>
  );
};

export default Play;
