import BaseHead from "~/components/BaseHead";
import { Card } from "~/components/Card";

export default function Home() {
  return (
    <div>
      <BaseHead />
      <Card type="number" color="red" num="5" />
    </div>
  );
}
