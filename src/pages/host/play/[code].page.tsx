import { type NextPage } from "next";
import { useRouter } from "next/router";
import BaseHead from "~/components/BaseHead";
import { PlayerCard } from "~/components/PlayerCard";
import { api } from "~/utils/api";

const Play: NextPage = () => {
  const router = useRouter();
  const getAllPlayers = api.player.getAll.useQuery(
    {
      code: router.query.code as string,
    },
    {
      enabled: !!router.query.code,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
  return (
    <>
      <BaseHead title="UNO - Host" />
      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="flex gap-10">
          {getAllPlayers?.data?.length &&
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
