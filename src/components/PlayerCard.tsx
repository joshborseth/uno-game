import { twMerge } from "tailwind-merge";

export const PlayerCard = ({
  name,
  cardsLeft,
  isPlayersTurn,
}: {
  name: string;
  cardsLeft?: number;
  isPlayersTurn: boolean | null;
}) => {
  return (
    <div className="flex flex-col items-center text-lg">
      <div
        className={twMerge(
          "flex h-[45px] w-[45px] items-center justify-center rounded-full border-2 border-primary bg-opacity-60 shadow-lg xl:h-[85px] xl:w-[85px]",
          isPlayersTurn && "animate-bounce",
        )}
      >
        <p className="uppercase">{name[0]}</p>
      </div>

      <p className="font-normal">{name}</p>
      {cardsLeft && (
        <div>
          <div className="flex flex-wrap gap-[2px]">
            {Array.from({ length: cardsLeft ?? 0 }).map((_, i) => (
              <MiniCard key={i} />
            ))}
            <p
              className={`text-xs ${
                cardsLeft === 1 && "text-md font-extrabold text-yellow-500"
              }`}
            >
              ({cardsLeft})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MiniCard = () => {
  return (
    <span className="no-highlight mask mask-half-1 flex h-4 w-3 items-center justify-center border border-gray-300 bg-black text-center text-[4px] text-white">
      UNO
    </span>
  );
};
