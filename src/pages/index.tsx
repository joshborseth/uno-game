import BaseHead from "~/components/BaseHead";
import { Card } from "~/components/Card";

export default function Home() {
  return (
    <>
      <BaseHead />
      <div className="flex min-h-screen w-full items-center justify-center">
        <Card type="wild" />
      </div>
    </>
  );
}
