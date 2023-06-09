import CardType from "./CardType";

enum CardColour {
    Colourful = "Colourful",
    Colourless = "Colourless",
}

export default CardColour;

export const GetCardColour = (cardType: CardType): CardColour =>
    [CardType.Heart, CardType.Diamond, CardType.ColourfulJoker].includes(cardType) ?
        CardColour.Colourful : CardColour.Colourless;