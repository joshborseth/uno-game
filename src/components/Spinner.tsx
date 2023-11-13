import { twMerge } from "tailwind-merge";

const Spinner = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const twClasses = twMerge(
    `loading loading-spinner text-primary-content`,
    size === "sm" ? "loading-sm" : size === "md" ? "loading-md" : "loading-lg",
  );
  return <span className={twClasses}></span>;
};

export default Spinner;
