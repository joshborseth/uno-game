import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { api } from "~/utils/api";

const PickupCard = ({ isPlayersTurn }: { isPlayersTurn: boolean }) => {
  const router = useRouter();
  const utils = api.useUtils();
  const drawCard = api.card.drawCardAndSurrenderTurn.useMutation();
  const playerUid = router.query.userId as string;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    if (!drawCard.isLoading && isPlayersTurn) {
      setIsTooltipVisible(true);
    } else {
      setIsTooltipVisible(false);
    }
  }, [isPlayersTurn, drawCard.isLoading]);

  return (
    <Tooltip text="Draw a Card" isToolTipVisible={isTooltipVisible}>
      <button
        onClick={() => {
          drawCard.mutate(
            {
              playerUid,
            },
            {
              onSuccess: () => {
                void utils.card.invalidate();
              },
              onError: (err) => {
                toast.error(err.message, {
                  id: err.message,
                });
              },
            },
          );
        }}
        className="translate-z stack relative translate-x-14 opacity-100 shadow-2xl disabled:opacity-50"
        disabled={drawCard.isLoading || !isPlayersTurn}
      >
        <div className="no-highlight duration-400 h-40 w-28 rounded-md border-2 border-black bg-black p-1 transition-all hover:translate-y-2 hover:scale-105">
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
    </Tooltip>
  );
};

export default PickupCard;

const Tooltip = ({
  text,
  children,
  isToolTipVisible,
}: {
  text: string;
  children: React.ReactNode;
  isToolTipVisible: boolean;
}) => {
  return (
    <div className="relative inline-block">
      {children}
      <div
        className={twMerge(
          "absolute left-1/2 top-full m-0 w-full max-w-sm -translate-x-1/2 transform rounded bg-primary p-2 text-center text-white transition-all duration-200",
          isToolTipVisible ? "opacity-100" : "opacity-0",
          isToolTipVisible ? "translate-y-0" : "-translate-y-4",
        )}
      >
        <div className="absolute -top-1 left-1/2 -ml-1 h-2 w-2 rotate-45 bg-primary" />
        {text}
      </div>
    </div>
  );
};
