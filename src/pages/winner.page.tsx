import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import BaseHead from "~/components/BaseHead";

const Winner = ({ winner }: { winner: string }) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const { height, width } = window.screen;
    setHeight(height);
    setWidth(width);
  }, []);

  if (!winner) return "Nobody won, get off this page";
  return (
    <>
      <BaseHead />
      <div className="flex min-h-screen w-full flex-wrap items-center justify-center">
        <Confetti
          width={width}
          height={height}
          initialVelocityY={20}
          initialVelocityX={10}
        />
        <h1 className="w-full text-center text-2xl">Thanks For Playing!</h1>
        <h2>{winner} has won!</h2>
      </div>
    </>
  );
};

export default Winner;
