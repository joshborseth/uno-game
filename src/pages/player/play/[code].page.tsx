import { useRouter } from "next/router";
import { type PresenceChannel } from "pusher-js";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import BaseHead from "~/components/BaseHead";
import { Card } from "~/components/Card";
import PickupCard from "~/components/PickupCard";
import { type Player } from "~/server/db/schema";
import { type RouterOutputs, api } from "~/utils/api";
import { getPusherInstance } from "~/utils/pusher";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";

import { EffectCards } from "swiper/modules";
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
          "flex h-screen w-full flex-col items-center justify-between overflow-hidden",
        )}
      >
        <div className="w-32" />
        <PickupCard isPlayersTurn={findMe?.isPlayersTurn ?? false} />
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
    <div className="w-48">
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
        cardsEffect={{
          perSlideOffset: 30,
          rotate: true,
          perSlideRotate: 5,
        }}
      >
        {cards.map((c) => {
          return (
            <SwiperSlide key={c.uid}>
              <Card
                card={{
                  ...c,
                }}
                actionsDisabled={disabled}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
