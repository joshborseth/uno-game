import { Card } from "./Card";
import { type RouterOutputs } from "~/utils/api";

export const CardToMatch = ({
  card,
}: {
  card: RouterOutputs["card"]["retrieveAllForCurrentPlayer"][number];
}) => {
  return (
    <Card
      isCardToMatch
      card={{
        ...card,
      }}
      key={card.uid}
      actionsDisabled={false}
      disableMouseEvents={true}
    />
  );
};
