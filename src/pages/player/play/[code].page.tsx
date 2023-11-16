import { useRouter } from "next/router";
import { type PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
  const [isMyTurn, setIsMyTurn] = useState(false);

  const getInitialCards = api.card.retrieveAllForCurrentPlayer.useQuery(
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
    if (findMe?.isPlayersTurn) {
      setIsMyTurn(true);
    }
  }, [getAllPlayers.data, userId, findMe]);

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
        oldPlayer: typeof Player.$inferSelect;
        message: string;
        newPlayer: typeof Player.$inferSelect;
      }) => {
        const { oldPlayer, newPlayer } = data;
        if (oldPlayer.uid === userId) {
          setIsMyTurn(false);
        }
        if (newPlayer.uid === userId) {
          setIsMyTurn(true);
          toast.success("It is your turn!", {
            id: "your-turn",
          });
        }
      },
    );

    return () => {
      pusher.unsubscribe(`presence-${code}`);
    };
  }, [code, name, userId]);

  const [cardHand, setCardHand] =
    useState<RouterOutputs["card"]["retrieveAllForCurrentPlayer"]>();

  useEffect(() => {
    if (getInitialCards.data?.length) {
      setCardHand(getInitialCards.data);
    }
  }, [getInitialCards.data]);

  return (
    <>
      <BaseHead title="UNO - Player" />
      <main className="flex h-screen w-full flex-col items-center justify-between">
        <div className="w-32" />
        <PickupCard />
        {!!cardHand?.length && (
          <CardHand cards={cardHand} disabled={!isMyTurn} />
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
  const playCardMutation = api.card.playCard.useMutation();

  const router = useRouter();
  const userId = router.query.userId as string;
  const utils = api.useUtils();
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
            handleClick={() =>
              playCardMutation.mutate(
                { playerUid: userId, cardUid: c.uid },
                {
                  onError: (error) => {
                    toast.error(error.message, {
                      id: error.message,
                    });
                  },
                  onSuccess: () => {
                    void utils.card.retrieveAllForCurrentPlayer.invalidate();
                  },
                },
              )
            }
          />
        );
      })}
    </div>
  );
};
