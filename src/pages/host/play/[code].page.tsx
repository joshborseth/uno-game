import { type NextPage } from "next";
import BaseHead from "~/components/BaseHead";
import { PlayerCard } from "~/components/PlayerCard";

const Play: NextPage = () => {
  return (
    <>
      <BaseHead title="UNO - Host" />
      <main className="flex min-h-screen w-full items-center justify-center">
        <div className="flex gap-10">
          <PlayerCard name="User 1" selected cardsLeft={7} />
          <PlayerCard name="User 1" cardsLeft={1} />
          <PlayerCard name="User 1" cardsLeft={7} />
          <PlayerCard name="User 1" cardsLeft={7} />
        </div>
      </main>
    </>
  );
};

export default Play;
