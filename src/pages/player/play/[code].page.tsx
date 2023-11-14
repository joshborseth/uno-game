import { useRouter } from "next/router";
import BaseHead from "~/components/BaseHead";
import CardHand from "~/components/CardHand";
import PickupCard from "~/components/PickupCard";
import { allPossibleCards } from "~/utils/fullDeckOfCards";
const Play = () => {
  const router = useRouter();
  const code = router.query.code as string;

  return (
    <>
      <BaseHead title={`UNO - ${code ?? ""}`} />
      <main className="flex  min-h-screen w-full flex-wrap items-center justify-center">
        <PickupCard />
        <CardHand cardArr={[...allPossibleCards]} />
      </main>
    </>
  );
};

export default Play;
