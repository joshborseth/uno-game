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
    const findMe = getAllPlayers.data?.find((p) => p.uid === userId);
    if (findMe?.isPlayersTurn) {
      setIsMyTurn(true);
    }
  }, [getAllPlayers.data, userId]);

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
        alert("turn changed");
        const { oldPlayer, newPlayer } = data;
        if (oldPlayer.uid === userId) {
          setIsMyTurn(false);
        }
        if (newPlayer.uid === userId) {
          setIsMyTurn(true);
          toast.success("It is your turn!");
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
      <main className="flex min-h-screen w-full flex-col flex-wrap items-center justify-between">
        <div className="w-32" />
        <PickupCard />
        {!!cardHand?.length && (
          <CardHand
            cards={cardHand}
            setCardHand={setCardHand}
            disabled={!isMyTurn}
          />
        )}
      </main>
    </>
  );
};

export default Play;

export const CardHand = ({
  cards,
  setCardHand,
  disabled,
}: {
  cards: RouterOutputs["card"]["retrieveAllForCurrentPlayer"];
  disabled: boolean;
  setCardHand: (
    cards: RouterOutputs["card"]["retrieveAllForCurrentPlayer"],
  ) => void;
}) => {
  const playCardMutation = api.card.playCard.useMutation();

  const router = useRouter();
  const userId = router.query.userId as string;

  return (
    <div className="flex h-full w-full gap-4 overflow-hidden">
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
                    toast.error(error.message);
                  },
                  onSuccess: () => {
                    const newCardHand = cards.filter(
                      (card) => card.uid !== c.uid,
                    );
                    setCardHand(newCardHand);
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
