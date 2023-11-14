import BaseHead from "~/components/BaseHead";
import CardHand from "~/components/CardHand";
import PickupCard from "~/components/PickupCard";

const Play = () => {
  return (
    <>
      <BaseHead title="UNO - Player" />
      <main className="flex min-h-screen w-full flex-wrap items-center justify-center">
        <PickupCard />
        <CardHand
          cardArr={[
            { color: "blue", type: "number", num: "3" },
            { color: "blue", type: "number", num: "2" },
            { type: "wild" },
            { type: "draw4" },
            { type: "reverse", color: "red" },
            { color: "red", type: "number", num: "2" },
            { color: "blue", type: "number", num: "2" },
            { color: "green", type: "number", num: "2" },
            { color: "red", type: "draw2" },
          ]}
        />
      </main>
    </>
  );
};

export default Play;
