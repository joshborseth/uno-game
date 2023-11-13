import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Home = () => {
  const router = useRouter();
  const [inputState, setInputState] = useState({
    name: "",
    code: "",
  });

  const joinRoom = api.room.join.useMutation({
    onSuccess: (code) => {
      void router.push(`/player/waiting-room/${code}`);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const createRoom = api.room.create.useMutation({
    onSuccess: (code) => {
      alert(code);
      void router.push(`/host/waiting-room/${code}`);
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10">
      <div className="hidden flex-col items-center justify-center gap-10 lg:flex">
        <h1 className="text-2xl font-bold">Uno</h1>
        <h2 className="text-xl">Let&apos;s get ready to rumble!</h2>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Host</h3>
            <p>Host a game to play with others!</p>
            <div className="card-actions justify-end">
              <button
                onClick={() => {
                  createRoom.mutate();
                }}
                className="btn btn-primary loading"
              >
                Select
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-full w-full items-center justify-center py-4 text-xl font-normal">
          <p>Or</p>
        </div>

        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Player</h2>
            <p>Play a game with others!</p>
            {/* <CardContent className="flex flex-col items-start gap-2">
            <Label htmlFor="name">Player Name:</Label>
            <Input
              onChange={(e) => {
                setInputState({ ...inputState, name: e.target.value });
              }}
              id="name"
              value={inputState.name}
            />
            <Label htmlFor="code">Game Code:</Label>
            <Input
              maxLength={4}
              onChange={(e) => {
                if (
                  e.target.value.split("").every((v) => {
                    const typedVal =
                      v.toUpperCase() as (typeof LETTERS)[number];
                    return LETTERS.includes(typedVal);
                  })
                ) {
                  setInputState({
                    ...inputState,
                    code: e.target.value.toUpperCase(),
                  });
                }
              }}
              value={inputState.code}
              id="room-code"
            />
            <LoadingButton
              isLoading={joinRoom.isLoading}
              onClick={() => {
                if (!inputState.name || !inputState.code)
                  return toast({
                    title: "You are a Moron!",
                    variant: "destructive",
                    description:
                      "Hey Moron! You have to fill out a name and a code to play 🤦‍♂️",
                  });

                joinRoom.mutate({
                  name: inputState.name,
                  code: inputState.code,
                });
              }}
            >
              Select
            </LoadingButton>
          </CardContent> */}
            <div className="card-actions justify-end">
              <button
                onClick={() => {
                  if (!inputState.name || !inputState.code)
                    return alert("You are a Moron!");
                  joinRoom.mutate({
                    name: inputState.name,
                    code: inputState.code,
                  });
                }}
                className="btn btn-primary loading"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
