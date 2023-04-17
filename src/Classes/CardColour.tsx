import CardType from "./CardType";

enum CardColour {
    Red = "Red",
    Black = "Black",
}

export default CardColour;

export const GetCardColour = (cardType: CardType): CardColour =>
    [CardType.Heart, CardType.Diamond, CardType.RedJoker].includes(cardType) ?
        CardColour.Red : CardColour.Black;