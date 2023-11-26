import { type NextPage } from "next";
import { useRouter } from "next/router";
import BaseHead from "~/components/BaseHead";
import { PlayerCard } from "~/components/PlayerCard";
import { api } from "~/utils/api";
import { type PresenceChannel } from "pusher-js";
import { useEffect } from "react";
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
    },
  );

  const getCurrentCardToMatch = api.card.getCurrentCardToMatch.useQuery(
    {
      code,
    },
    {
      enabled: !!code,
    },
  );

  const utils = api.useUtils();

  useEffect(() => {
    if (!code || !name || !userId) return;

    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;

    channel.bind("card-played", () => {
      void utils.card.getCurrentCardToMatch.invalidate();
    });
    channel.bind("turn-changed", () => {
      void utils.player.getAll.invalidate();
    });

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [
    code,
    name,
    userId,
    utils.card.getCurrentCardToMatch,
    utils.player.getAll,
  ]);

  if (!getCurrentCardToMatch.data || !getAllPlayers.data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
        <Spinner size="lg" accent />
      </div>
    );
  }

  return (
    <>
      <BaseHead title="UNO - Host" />
      <main className="flex h-screen w-full flex-col items-center justify-center gap-4 overflow-y-hidden py-6">
        <div className="flex flex-col items-center justify-center gap-5">
          <h2 className="text-2xl font-bold">Card To Match:</h2>
          <CardToMatch card={getCurrentCardToMatch.data} />
        </div>

        <div className="flex w-full flex-wrap justify-center gap-4 px-2">
          {!!getAllPlayers?.data?.length &&
            getAllPlayers.data.map((player) => (
              <div key={player.uid}>
                <PlayerCard
                  isPlayersTurn={player.isPlayersTurn}
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
    <h1 className="text-7xl font-bold uppercase text-primary underline underline-offset-4">
      Uno
    </h1>
  );
};
