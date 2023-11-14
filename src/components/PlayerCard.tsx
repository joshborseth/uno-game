import { twMerge } from "tailwind-merge";

export const PlayerCard = ({
  name,
  selected,
  cardsLeft,
}: {
  name: string;
  selected?: boolean;
  cardsLeft?: number;
}) => {
  return (
    <div className="flex flex-col items-center text-lg">
      <div
        className={` flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-accent bg-opacity-60 ${
          selected && "bg-accent"
        } shadow-lg`}
      >
        <p className="uppercase">{name[0]}</p>
      </div>

      <p className="font-normal">{name}</p>
      {cardsLeft && (
        <div>
          <div className="flex gap-[2px]">
            {Array.from({ length: cardsLeft ?? 0 }).map(
              (_, i) => i < 10 && <MiniCard key={i} />,
            )}
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
      {/* <span className="text-red-500">U</span>
      <span className="text-green-500">N</span>
      <span className="text-blue-500">O</span> */}
      UNO
    </span>
  );
};
