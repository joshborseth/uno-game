import { useState } from "react";
import { Card } from "./Card";
import type { CardProps } from "./Card";
import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";

const CardHand = ({ cardArr }: { cardArr: CardProps[] }) => {
  const [page, setPage] = useState(0);
  const maxPerPage = 5;
  const sortedCards = cardArr.sort((a, b) => {
    // New Card will always be at the start of the hand
    // Everything else is sorted by color or type if it's a wild card
    if (a.drawingNew) return -1;
    if (b.drawingNew) return 0;
    if (a.type === "wild" || a.type === "draw4") return 1;
    if (b.type === "wild" || b.type === "draw4") return -1;
    return a.color.localeCompare(b.color, "en", { usage: "sort" });
  });
  const handleForward = () => {
    setPage(page + 1);
  };
  const handleBack = () => {
    setPage(page - 1);
  };
  const handleNewCardAnimation = () => {
    console.log("this runs and end of new card animation");
  };

  return (
    <div className="relative bottom-0 flex w-screen gap-1 self-end overflow-auto bg-white p-4 shadow-2xl md:justify-center">
      {page > 0 ? (
        <BackArrow handleBack={handleBack} />
      ) : (
        <div className="w-28" />
      )}
      {sortedCards.map((card, index) => {
        if (index >= page * maxPerPage && index < (page + 1) * maxPerPage) {
          return (
            <div className="flex justify-center" key={index}>
              <Card {...card} animationEnd={handleNewCardAnimation} />
            </div>
          );
        }
      })}
      {(1 + page) * maxPerPage <= cardArr.length && (
        <ForwardArrow handleForward={handleForward} />
      )}
    </div>
  );
};

export default CardHand;

const ForwardArrow = ({ handleForward }: { handleForward: () => void }) => {
  return (
    <div
      className="flex w-28 cursor-pointer items-center justify-center px-2 text-secondary"
      onClick={() => {
        handleForward();
      }}
    >
      <BsArrowRightSquareFill className="h-12 w-12" />
    </div>
  );
};

const BackArrow = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <div
      className="flex w-28 cursor-pointer items-center justify-center px-2 text-secondary"
      onClick={() => {
        handleBack();
      }}
    >
      <BsArrowLeftSquareFill className="h-12 w-12" />
    </div>
  );
};
