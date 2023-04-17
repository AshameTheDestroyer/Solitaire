import CardColour, { GetCardColour } from "./CardColour";
import CardDigit from "./CardDigit";
import CardType from "./CardType";

type CardConstructorProps = {
    digit: CardDigit,
    type: CardType,
};

export default class Card {
    public digit: CardDigit;
    public type: CardType;
    public colour: CardColour;

    constructor(props: CardConstructorProps) {
        if ([CardType.RedJoker, CardType.BlackJoker].includes(props.type) &&
            props.digit != CardDigit.Joker) {
            throw new Error("Joker types cannot have a digit that is not Joker.");
        }

        if (![CardType.RedJoker, CardType.BlackJoker].includes(props.type) &&
            props.digit == CardDigit.Joker) {
            throw new Error("Non-Joker types cannot have a digit that is Joker.");
        }

        this.digit = props.digit;
        this.type = props.type;
        this.colour = GetCardColour(this.type);
    }

    public get number() {
        return this.digit == CardDigit.Ace ? 1 : Number.parseInt(this.digit);
    }
}

export const Deck = Object.values(CardType)
    .map(cardType => Object.values(CardDigit)
        .map(cardDigit => {
            try { return new Card({ digit: cardDigit, type: cardType }); }
            catch { return null; }
        }).filter(card => card != null)
        .map<Card>(card => {
            if (card == null) { throw new Error("Card cannot be null."); }

            return card;
        })
    ).flat();