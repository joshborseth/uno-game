import { useRouter } from "next/router";
import { type PresenceChannel } from "pusher-js";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import BaseHead from "~/components/BaseHead";
import { Card } from "~/components/Card";
import PickupCard from "~/components/PickupCard";
import { type Player } from "~/server/db/schema";
import { type RouterOutputs, api } from "~/utils/api";
import { getPusherInstance } from "~/utils/pusher";

const Play = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const code = router.query.code as string;
  const name = router.query.name as string;
  const utils = api.useUtils();
  const cardsForCurrentPlayer = api.card.retrieveAllForCurrentPlayer.useQuery(
    {
      playerUid: userId,
    },
    {
      enabled: !!userId,
    },
  );
  const getAllPlayers = api.player.getAll.useQuery(
    {
      code,
    },
    {
      enabled: !!code,
    },
  );
  const findMe = getAllPlayers.data?.find((p) => p.uid === userId);

  useEffect(() => {
    if (!code || !name || !userId) return;
    const pusher = getPusherInstance({
      userId: userId,
      userName: name,
    });
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel;

    channel.bind(
      "turn-changed",
      (data: {
        message: "Turn Switched";
        newPlayer: typeof Player.$inferSelect;
        oldPlayer: typeof Player.$inferSelect;
      }) => {
        if (data.newPlayer.uid === userId) {
          toast("It's your turn!");
        }
        void utils.player.getAll.invalidate();
      },
    );

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code, name, userId, utils.player.getAll]);

  return (
    <>
      <BaseHead title="UNO - Player" />
      <main
        className={twMerge(
          "flex h-screen w-full flex-col items-center justify-between",
        )}
      >
        <div className="w-32" />
        <PickupCard />
        {!!cardsForCurrentPlayer.data?.length && (
          <CardHand
            cards={cardsForCurrentPlayer.data}
            disabled={!findMe?.isPlayersTurn}
          />
        )}
      </main>
    </>
  );
};

export default Play;

export const CardHand = ({
  cards,
  disabled,
}: {
  cards: RouterOutputs["card"]["retrieveAllForCurrentPlayer"];
  disabled: boolean;
}) => {
  return (
    <div className="flex w-screen items-center gap-4 overflow-auto p-10 md:justify-center">
      {cards.map((c) => {
        return (
          <Card
            card={{
              ...c,
            }}
            key={c.uid}
            actionsDisabled={disabled}
          />
        );
      })}
    </div>
  );
};
