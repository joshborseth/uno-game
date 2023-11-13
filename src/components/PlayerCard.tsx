export const PlayerCard = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col items-center text-lg">
      <div className="border-accent flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 shadow-lg">
        <p className="uppercase">{name[0]}</p>
      </div>

      <p className="font-normal">{name}</p>
    </div>
  );
};
