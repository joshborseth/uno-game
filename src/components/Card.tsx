import { twMerge } from "tailwind-merge";
import { type RouterOutputs, api } from "~/utils/api";
import Spinner from "./Spinner";

const bgColorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
};

const textColorMap = {
  red: "text-red-500",
  blue: "text-blue-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
};

export const Card = (props: {
  card: RouterOutputs["card"]["retrieveAllForCurrentPlayer"][number];
  handleClick: () => void;
  actionsDisabled: boolean;
  disableMouseEvents?: boolean;
}) => {
  const noColorCondition =
    props.card.type === "wild" || props.card.type === "draw4";
  const bgTwColor = noColorCondition
    ? "bg-black"
    : bgColorMap[props.card.color!];
  const textTwColor = noColorCondition
    ? "text-black"
    : textColorMap[props.card.color!];

  const shadowColor = noColorCondition ? "#fff" : "#000";

  const heightOfWhite = props.card.type === "number" ? "h-5/6" : "h-2/3";
  const getText = ({ type }: { type?: "shortened" }) => {
    if (props.card.type === "number") {
      return props.card.numberValue;
    } else if (props.card.type === "reverse") {
      if (type === "shortened") return "R";
      return "Reverse";
    } else if (props.card.type === "skip") {
      if (type === "shortened") return "S";
      return "Skip";
    } else if (props.card.type === "draw4") {
      if (type === "shortened") return "Wild";
      return "Draw four";
    } else if (props.card.type === "wild") {
      return "Wild";
    } else if (props.card.type === "draw2") {
      if (type === "shortened") return "D";
      return "Draw two";
    }
  };

  // Playing Card Functionality
  const mutation = api.card.playCard.useMutation();

  return (
    <button
      className={twMerge(
        "ring-primary relative rounded transition-all",
        props.actionsDisabled
          ? "pointer-events-none opacity-40"
          : "hover:scale-[1.07]",
        props.disableMouseEvents && "pointer-events-none",
        props.card.type === "wild" &&
          props.card.wildColor &&
          `ring-4 ring-${props.card.wildColor}-500`,
      )}
      onClick={() => {
        props.handleClick();
      }}
    >
      {mutation.isLoading ? (
        <div className="flex h-40 w-28 items-center justify-center">
          <Spinner size="md" />
        </div>
      ) : (
        <div
          className={`no-highlight relative z-50 w-28 rounded-md ${bgTwColor} backface-hidden flex h-40 flex-col items-center justify-center border-2 border-black px-4 transition-all`}
        >
          <p
            className={`${
              props.card.type === "wild" || props.card.type === "draw4"
                ? "text-black"
                : "text-white"
            } absolute left-2 top-2 z-10 text-xl font-black`}
            style={{
              textShadow: `2px 2px 0 ${shadowColor},
        -1px -1px 0 ${shadowColor},  
         1px -1px 0 ${shadowColor},
         -1px 1px 0 ${shadowColor},
          1px 1px 0 ${shadowColor}`,
            }}
          >
            {getText({})}
          </p>
          <p
            className={`${
              props.card.type === "wild" || props.card.type === "draw4"
                ? "text-black"
                : "text-white"
            } absolute bottom-2 right-2 text-xl font-black`}
            style={{
              textShadow: `2px 2px 0 ${shadowColor},
        -1px -1px 0 ${shadowColor},  
         1px -1px 0 ${shadowColor},
         -1px 1px 0 ${shadowColor},
          1px 1px 0 ${shadowColor}`,
            }}
          >
            {getText({})}
          </p>
          {props.card.type === "draw4" && (
            <>
              <div
                className={`w-full ${heightOfWhite} relative -z-10 grid grid-cols-2`}
              >
                <div className="h-full w-full rounded-tl-[75px] bg-red-500" />
                <div className="h-full w-full bg-blue-500" />
                <div className="h-full w-full bg-yellow-500" />
                <div className="h-full w-full rounded-br-[75px] bg-green-500" />
                <p
                  style={{
                    textShadow: `2px 2px 0 #000,
              -1px -1px 0 ${shadowColor},  
               1px -1px 0 ${shadowColor},
               -1px 1px 0 ${shadowColor},
                1px 1px 0 ${shadowColor}`,
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-5xl font-black text-white"
                >
                  {getText({ type: "shortened" })}
                </p>
              </div>
            </>
          )}
          {(props.card.type === "number" ||
            props.card.type === "reverse" ||
            props.card.type === "skip" ||
            props.card.type === "draw2") && (
            <div
              className={`w-full rounded-tl-[75px] bg-white ${heightOfWhite} flex items-center justify-center rounded-br-[75px]`}
            >
              <p
                className={`text-4xl font-black ${textTwColor}`}
                style={{
                  textShadow: `3px 3px 0 ${shadowColor},
                -1px -1px 0 ${shadowColor},  
                 1px -1px 0 ${shadowColor},
                 -1px 1px 0 ${shadowColor},
                  1px 1px 0 ${shadowColor}`,
                }}
              >
                {getText({ type: "shortened" })}
              </p>
            </div>
          )}

          {props.card.type === "wild" && (
            <>
              <div
                className={`w-full rounded-tl-[75px] bg-white ${heightOfWhite} flex items-center justify-center rounded-br-[75px]`}
              >
                <p
                  className={`text-5xl font-black text-yellow-500`}
                  style={{
                    textShadow: `3px 3px 0 #000,
                -1px -1px 0 #000,  
                 1px -1px 0 #000,
                 -1px 1px 0 #000,
                  1px 1px 0 #000`,
                  }}
                >
                  {getText({ type: "shortened" })![0]}
                </p>
                <p
                  className={`text-5xl font-black text-blue-500`}
                  style={{
                    textShadow: `3px 3px 0 #000,
                -1px -1px 0 #000,  
                 1px -1px 0 #000,
                 -1px 1px 0 #000,
                  1px 1px 0 #000`,
                  }}
                >
                  {getText({ type: "shortened" })![1]}
                </p>
                <p
                  className={`text-5xl font-black text-red-500`}
                  style={{
                    textShadow: `3px 3px 0 #000,
                -1px -1px 0 #000,  
                 1px -1px 0 #000,
                 -1px 1px 0 #000,
                  1px 1px 0 #000`,
                  }}
                >
                  {getText({ type: "shortened" })![2]}
                </p>
                <p
                  className={`text-5xl font-black text-green-500`}
                  style={{
                    textShadow: `3px 3px 0 #000,
                -1px -1px 0 #000,  
                 1px -1px 0 #000,
                 -1px 1px 0 #000,
                  1px 1px 0 #000`,
                  }}
                >
                  {getText({ type: "shortened" })![3]}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </button>
  );
};
