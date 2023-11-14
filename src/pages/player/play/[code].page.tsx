import BaseHead from "~/components/BaseHead";
import CardHand from "~/components/CardHand";
import PickupCard from "~/components/PickupCard";

const Play = () => {
  return (
    <>
      <BaseHead title="UNO - Player" />
      <main className="flex min-h-screen w-full flex-wrap items-center justify-center">
        <PickupCard />
        <CardHand cardArr={[]} />
      </main>
    </>
  );
};

export default Play;
