import { useRef } from "react";
import { Card } from "./Card";
import type { CardProps } from "./Card";
import { useRouter } from "next/router";

const CardHand = ({
  cardArr,
  playersInLobby,
}: {
  cardArr: CardProps[];
  playersInLobby: (string | null)[];
}) => {
  const router = useRouter();
  const currentPlayer = router.query.name as string;
  // TODO: Change playersInLobby to be a list of players in the lobby

  const sortedCards = cardArr.sort((a, b) => {
    // New Card will always be at the start of the hand
    // Everything else is sorted by color or type if it's a wild card
    if (a.drawingNew) return -1;
    if (b.drawingNew) return 0;
    if (a.type === "wild" || a.type === "draw4") return 1;
    if (b.type === "wild" || b.type === "draw4") return -1;
    return a.color.localeCompare(b.color, "en", { usage: "sort" });
  });

  const handleNewCardAnimation = () => {
    console.log("this runs and end of new card animation");
    // TODO: remove the new card prop from users hand
  };
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const handleModalClick = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button
        className="btn btn-primary z-30 w-32"
        onClick={() => {
          handleModalClick();
        }}
      >
        CALL UNO
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box [&>*:nth-child(odd)]:bg-gray-300">
          {playersInLobby.map((player, index) => {
            if (player === currentPlayer) return null;
            // Cannot call uno on self
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Called Uno On", player);

                  //  TODO: CALL UNO ON FUNCTIONALITY
                  modalRef.current?.close();
                }}
                className="flex h-10 w-full cursor-pointer items-center px-2 hover:underline"
              >
                {player}
              </div>
            );
          })}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
      <div className="relative bottom-0 flex w-screen gap-1 self-end overflow-auto bg-white p-4 shadow-2xl md:justify-center">
        {sortedCards.map((card) => {
          return (
            <div className="flex justify-center" key={card.key}>
              <Card {...card} animationEnd={handleNewCardAnimation} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CardHand;
