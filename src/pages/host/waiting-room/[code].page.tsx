import { useRouter } from "next/router";
import { PlayerCard } from "../../components/PlayerCard";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { pusher } from "@/lib/pusher";

const WaitingRoom = () => {
  const router = useRouter();
  const code = router.query.code as string;
  useEffect(() => {
    const channel = pusher.subscribe(code);
    channel.bind("room-join", (data: any) => {
      console.log(data);
    });
    return () => pusher.unsubscribe(code);
  }, [code]);

  return (
    <div className="min-h-screen w-screen justify-center items-center text-4xl font-bold flex flex-col gap-10">
      <div className="text-center flex flex-col gap-2">
        <h1>Everyone Join!</h1>
        <h2 className="text-2xl font-normal">Room Code is {code}</h2>
      </div>
      <div className="flex flex-wrap gap-4 py-4">
        <PlayerCard name="Joshua" />
        <PlayerCard name="Jedeer" />
        <PlayerCard name="Hanging Out" />
        <PlayerCard name="Miah" />
        <PlayerCard name="Mike" />
        <PlayerCard name="Dearest" />
        <PlayerCard name="Benny" />
      </div>
      {/* TODO make this redirect us over to the play page */}
      <Button>Everyone In?</Button>
    </div>
  );
};

export default WaitingRoom;
