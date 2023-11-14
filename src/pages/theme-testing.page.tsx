import Link from "next/link";
import React from "react";
import CardHand from "~/components/CardHand";
import PickupCard from "~/components/PickupCard";
import SelectColourModal from "~/components/SelectColourModal";

const ThemeTesting = () => {
  return (
    <div className="flex min-h-screen w-full flex-wrap items-end justify-center">
      <SelectColourModal />
    </div>
  );
};

export default ThemeTesting;
