import React from "react";
import CardHand from "~/components/CardHand";

const ThemeTesting = () => {
  return (
    <div className="flex min-h-screen w-full flex-wrap items-end justify-center">
      <CardHand
        cardArr={[
          { color: "blue", type: "number", num: "3" },
          { color: "blue", type: "number", num: "2" },
          { type: "wild" },
          { type: "draw4", drawingNew: true },
          { type: "reverse", color: "red" },
          { color: "red", type: "number", num: "2" },
          { color: "blue", type: "number", num: "2" },
          { color: "green", type: "number", num: "2" },
          { color: "red", type: "draw2" },
        ]}
      />
    </div>
  );
};

export default ThemeTesting;
