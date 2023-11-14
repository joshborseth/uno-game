import { useEffect, useRef } from "react";

const SelectColourModal = () => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const handleModalClick = () => {
    modalRef.current?.showModal();
  };
  const handleColorSelect = (color: string) => {
    switch (color) {
      case "red":
        console.log("red");
        break;
      case "green":
        console.log("green");
        break;
      case "blue":
        console.log("blue");
        break;
      case "yellow":
        console.log("yellow");
        break;
      default:
        console.log("no color selected, color should stay the same??");
        // This should never happen
        break;
    }
    modalRef.current?.close();
  };
  useEffect(() => {
    // This opens the modal on page load
    handleModalClick();
    // TODO: Remove this use effect and replace with a
    // function that is called when a wild card is played
  }, []);

  return (
    <>
      <dialog
        ref={modalRef}
        className="modal"
        onClose={() => {
          console.log("closed modal");
        }}
      >
        <div className="modal-box">
          <div className="flex flex-wrap justify-center gap-2">
            <h1 className="w-full text-center text-xl">Select New Colour.</h1>
            <div className="mask-circle grid h-[200px] w-[200px] grid-cols-2 grid-rows-2 gap-1">
              <button
                className="h-full w-full bg-red-500 text-red-800"
                onClick={() => {
                  handleColorSelect("red");
                }}
              >
                Red
              </button>
              <button
                className="h-full w-full bg-green-500 text-green-800"
                onClick={() => {
                  handleColorSelect("green");
                }}
              >
                Green
              </button>
              <button
                className="h-full w-full bg-blue-500 text-blue-800"
                onClick={() => {
                  handleColorSelect("blue");
                }}
              >
                Blue
              </button>
              <button
                className="h-full w-full bg-yellow-500 text-yellow-800"
                onClick={() => {
                  handleColorSelect("yellow");
                }}
              >
                Yellow
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default SelectColourModal;
