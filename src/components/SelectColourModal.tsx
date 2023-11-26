import toast from "react-hot-toast";
import { type COLORS } from "~/constants/colors";
import { api } from "~/utils/api";

const SelectColourModal = ({
  open,
  setOpen,
  cardUid,
  playerUid,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  cardUid: string;
  playerUid: string;
}) => {
  const playCardMutation = api.card.playCard.useMutation();
  const utils = api.useUtils();
  const handleColorSelect = (color: (typeof COLORS)[number]) => {
    playCardMutation.mutate(
      {
        cardUid,
        playerUid,
        wildColor: color,
      },
      {
        onSuccess: () => {
          setOpen(false);
          void utils.card.invalidate();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };
  return (
    <>
      <dialog open={open} onClose={() => setOpen(false)} className="modal">
        <div className="modal-box">
          <div className="flex flex-wrap justify-center gap-4">
            <h2 className="w-full text-center text-2xl font-bold">
              Select New Colour
            </h2>
            <div className="mask-circle grid h-[200px] w-[200px] grid-cols-2 grid-rows-2 gap-1">
              <button
                className="h-full w-full bg-red-500 text-red-800 disabled:opacity-50"
                disabled={playCardMutation.isLoading}
                onClick={() => {
                  handleColorSelect("red");
                }}
              />

              <button
                disabled={playCardMutation.isLoading}
                className="h-full w-full bg-green-500 text-green-800 disabled:opacity-50"
                onClick={() => {
                  handleColorSelect("green");
                }}
              />
              <button
                disabled={playCardMutation.isLoading}
                className="h-full w-full bg-blue-500 text-blue-800 disabled:opacity-50"
                onClick={() => {
                  handleColorSelect("blue");
                }}
              />

              <button
                disabled={playCardMutation.isLoading}
                className="h-full w-full bg-yellow-500 text-yellow-800 disabled:opacity-50"
                onClick={() => {
                  handleColorSelect("yellow");
                }}
              />
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-black opacity-60">
          <button />
        </form>
      </dialog>
    </>
  );
};

export default SelectColourModal;
