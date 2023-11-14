import { twMerge } from "tailwind-merge";

const Spinner = ({
  size,
  accent,
}: {
  size: "sm" | "md" | "lg";
  accent?: boolean;
}) => {
  const twClasses = twMerge(
    `loading loading-spinner`,
    size === "sm" ? "loading-sm" : size === "md" ? "loading-md" : "loading-lg",
    accent ? "text-primary" : "text-primary-content",
  );
  return <span className={twClasses}></span>;
};

export default Spinner;
