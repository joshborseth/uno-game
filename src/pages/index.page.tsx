import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { LETTERS } from "~/constants/letters";
import toast from "react-hot-toast";
import BaseHead from "~/components/BaseHead";

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
      toast.error(err.message);
    },
  });

  const createRoom = api.room.create.useMutation({
    onSuccess: (code) => {
      toast.success(`Room Created! Here is your room code: ${code}`);
      void router.push(`/host/waiting-room/${code}`);
    },
  });
  return (
    <>
      <BaseHead />
      <main className="flex min-h-screen flex-col items-center justify-center gap-10">
        <h1 className="pb-10 text-7xl font-black">Uno</h1>

        <section className="flex w-full flex-col items-center justify-center gap-10 px-4 sm:flex-row sm:items-start">
          <div className="card bg-primary-content border-primary flex flex-col gap-4 border shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Host</h3>
              <p className="font-extralight">
                Host a game to play with others!
              </p>
              <div className="card-actions justify-start">
                <button
                  onClick={() => {
                    createRoom.mutate();
                  }}
                  className="btn btn-primary"
                >
                  Select
                  {createRoom.isLoading && (
                    <span className="loading loading-spinner" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-primary-content border-primary border shadow-xl">
            <div className="card-body flex flex-col gap-6">
              <div>
                <h2 className="card-title">Player</h2>
                <p className="font-extralight">Play a game with others!</p>
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="name">Player Name:</label>
                <input
                  id="name"
                  type="text"
                  onChange={(e) => {
                    setInputState({ ...inputState, name: e.target.value });
                  }}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="room-code">Game Code:</label>
                <input
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
                  className="input input-bordered w-full max-w-xs"
                  id="room-code"
                />
              </div>
              <div className="card-actions justify-start">
                <button
                  onClick={() => {
                    if (!inputState.name || !inputState.code)
                      return toast.error("Please fill out all fields");
                    joinRoom.mutate({
                      name: inputState.name,
                      code: inputState.code,
                    });
                  }}
                  className="btn btn-primary"
                >
                  Select
                  {joinRoom.isLoading && (
                    <span className="loading loading-spinner" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
