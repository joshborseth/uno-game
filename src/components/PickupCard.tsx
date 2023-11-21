import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const PickupCard = ({ isPlayersTurn }: { isPlayersTurn: boolean }) => {
  const router = useRouter();
  const utils = api.useUtils();
  const drawCard = api.card.drawCardAndSurrenderTurn.useMutation();
  const playerUid = router.query.userId as string;

  return (
    <>
      <button
        onClick={() => {
          drawCard.mutate(
            {
              playerUid,
            },
            {
              onSuccess: () => {
                void utils.card.retrieveAllForCurrentPlayer.invalidate();
              },
              onError: (err) => {
                toast.error(err.message, {
                  id: err.message,
                });
              },
            },
          );
        }}
        className="translate-z stack translate-x-14 opacity-100 shadow-2xl disabled:opacity-50"
        disabled={drawCard.isLoading || !isPlayersTurn}
      >
        <div className="no-highlight h-40 w-28 rounded-md border-2 border-black bg-black p-1">
          <div className="relative h-full w-full border-2 border-white p-1">
            <div className="-ml-2 -mt-6 flex h-full w-full -rotate-12 flex-col items-center justify-center text-4xl font-bold uppercase text-white">
              <p className="-mb-1 ml-4">Uno</p>
              <div className="h-1 w-full bg-red-500" />
              <div className="h-1 w-full bg-yellow-500" />
              <div className="h-1 w-full bg-blue-500" />
              <div className="h-1 w-full bg-green-500" />
            </div>
            <p className="absolute bottom-0 left-0 p-1 text-sm font-light text-white">
              &copy;JB
            </p>
          </div>
        </div>
        <div className="no-highlight h-44 w-32 rounded-md border-2 border-black bg-black p-1"></div>
        <div className="no-highlight h-44 w-32 rounded-md border-2 border-black bg-black p-1"></div>
      </button>
    </>
  );
};

export default PickupCard;
