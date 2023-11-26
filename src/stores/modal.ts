import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  cardUid: string;
  setCardUid: (uid: string) => void;
};

export const useModalState = create<ModalState>((set) => {
  return {
    isOpen: false,
    setOpen: (open: boolean) => set({ isOpen: open }),
    cardUid: "",
    setCardUid: (uid: string) => set({ cardUid: uid }),
  };
});
