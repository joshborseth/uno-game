import type { COLORS } from "../constants/colors";
import type { NUMBERS } from "../constants/nums";
import { BackOfCard } from "./BackOfCard";
import { useState } from "react";

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

type CardProps =
  | {
      color: (typeof COLORS)[number];
      num: (typeof NUMBERS)[number];
      type: "number";
    }
  | {
      color: (typeof COLORS)[number];
      type: "reverse";
    }
  | {
      type: "wild";
    }
  | {
      color: (typeof COLORS)[number];
      type: "draw2";
    }
  | {
      type: "draw4";
    }
  | {
      color: (typeof COLORS)[number];
      type: "skip";
    };

export const Card = (props: CardProps) => {
  const [animation, setAnimation] = useState("motion-safe:animate-flip-card");
  const noColorCondition = props.type === "wild" || props.type === "draw4";
  const bgTwColor = noColorCondition ? "bg-black" : bgColorMap[props.color];
  const textTwColor = noColorCondition
    ? "text-black"
    : textColorMap[props.color];

  const shadowColor = noColorCondition ? "#fff" : "${shadowColor}";

  const heightOfWhite = props.type === "number" ? "h-5/6" : "h-2/3";
  const getText = ({ type }: { type?: "shortened" }) => {
    if (props.type === "number") {
      return props.num;
    } else if (props.type === "reverse") {
      if (type === "shortened") return "R";
      return "Reverse";
    } else if (props.type === "skip") {
      if (type === "shortened") return "S";
      return "Skip";
    } else if (props.type === "draw4") {
      if (type === "shortened") return "Wild";
      return "Draw four";
    } else if (props.type === "wild") {
      return "Wild";
    } else if (props.type === "draw2") {
      if (type === "shortened") return "D";
      return "Draw two";
    }
  };

  return (
    <button className="relative transition-all hover:scale-[1.03] focus:scale-[1.03]">
      <div
        className={`no-highlight w-56 rounded-md ${bgTwColor} backface-hidden flex h-80 flex-col items-center justify-center border-2 border-black px-4 transition-all ${animation}`}
        onAnimationEnd={() => setAnimation("")}
        onClick={() => setAnimation("motion-safe:animate-flip-card")}
      >
        <p
          className={`${
            props.type === "wild" || props.type === "draw4"
              ? "text-black"
              : "text-white"
          } absolute left-2 top-2 text-4xl font-black`}
          style={{
            textShadow: `3px 3px 0 ${shadowColor},
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
            props.type === "wild" || props.type === "draw4"
              ? "text-black"
              : "text-white"
          } absolute bottom-2 right-2 text-4xl font-black`}
          style={{
            textShadow: `3px 3px 0 ${shadowColor},
          -1px -1px 0 ${shadowColor},  
           1px -1px 0 ${shadowColor},
           -1px 1px 0 ${shadowColor},
            1px 1px 0 ${shadowColor}`,
          }}
        >
          {getText({})}
        </p>
        {props.type === "draw4" && (
          <>
            <div
              className={`w-full ${heightOfWhite} relative grid grid-cols-2`}
            >
              <div className="h-full w-full rounded-tl-[75px] bg-red-500" />
              <div className="h-full w-full bg-blue-500" />
              <div className="h-full w-full bg-yellow-500" />
              <div className="h-full w-full rounded-br-[75px] bg-green-500" />
              <p
                style={{
                  textShadow: `3px 3px 0 #000,
                -1px -1px 0 #000,  
                 1px -1px 0 #000,
                 -1px 1px 0 #000,
                  1px 1px 0 #000`,
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-7xl font-black text-white"
              >
                {getText({ type: "shortened" })}
              </p>
            </div>
          </>
        )}
        {(props.type === "number" ||
          props.type === "reverse" ||
          props.type === "skip" ||
          props.type === "draw2") && (
          <div
            className={`w-full rounded-tl-[75px] bg-white ${heightOfWhite} flex items-center justify-center rounded-br-[75px]`}
          >
            <p
              className={`text-7xl font-black ${textTwColor}`}
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

        {props.type === "wild" && (
          <div
            className={`w-full rounded-tl-[75px] bg-white ${heightOfWhite} flex items-center justify-center rounded-br-[75px]`}
          >
            <p
              className={`text-7xl font-black text-yellow-500`}
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
              className={`text-7xl font-black text-blue-500`}
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
              className={`text-7xl font-black text-red-500`}
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
              className={`text-7xl font-black text-green-500`}
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
        )}
      </div>
      <BackOfCard animation={animation} />
    </button>
  );
};
