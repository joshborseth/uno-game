export const BackOfCard = () => {
  return (
    <div
      className={`no-highlight absolute left-0 top-0 z-10 h-40 w-28 rounded-md border-2 border-black bg-black p-1`}
    >
      <div className="relative h-full w-full border-2 border-white p-1">
        <div className="-ml-2 -mt-6 flex h-full w-full -rotate-12 flex-col items-center justify-center text-4xl font-bold uppercase text-white">
          <p className="-mb-1 ml-4">Uno</p>
          <div className="h-1 w-full bg-red-500" />
          <div className="h-1 w-full bg-yellow-500" />
          <div className="h-1 w-full bg-blue-500" />
          <div className="h-1 w-full bg-green-500" />
        </div>
        <p className="absolute bottom-0 left-0 p-1 text-sm font-light text-white">
          &copy;JB
        </p>
      </div>
    </div>
  );
};
