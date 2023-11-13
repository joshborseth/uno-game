import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";

export const BackButton = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      <FaArrowLeft />
    </button>
  );
};
