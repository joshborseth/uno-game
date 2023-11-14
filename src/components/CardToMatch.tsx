import { Card } from "./Card";
import { type RouterOutputs } from "~/utils/api";

export const CardToMatch = ({
  card,
}: {
  card: RouterOutputs["card"]["retrieveAllForCurrentPlayer"][number];
}) => {
  return (
    <Card
      color={card.color ?? "red"}
      type={card.type ?? "number"}
      num={card.numberValue ?? "0"}
      cardId={card.uid}
      userId={""}
      wildColor={"red"}
      actionsDisabled
    />
  );
};
