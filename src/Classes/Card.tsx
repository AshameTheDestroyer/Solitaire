import CardColour, { GetCardColour } from "./CardColour";
import CardDigit from "./CardDigit";
import CardType from "./CardType";

type CardConstructorProps = {
    digit: CardDigit,
    type: CardType,
};

type ComparisonResultType = -1 | 0 | 1 | null;

export default class Card {
    public digit: CardDigit;
    public type: CardType;
    public colour: CardColour;

    constructor(props: CardConstructorProps) {
        this.digit = props.digit;
        this.type = props.type;
        this.colour = GetCardColour(this.type);

        if (this.isJoker && props.digit != CardDigit.Joker) {
            throw new Error("Joker types cannot have a digit that is not Joker.");
        }

        if (!this.isJoker && props.digit == CardDigit.Joker) {
            throw new Error("Non-Joker types cannot have a digit that is Joker.");
        }
    }

    public get number(): number {
        return this.digit == CardDigit.Ace ? 1 : Number.parseInt(this.digit);
    }

    public get isJoker(): boolean {
        return [CardType.ColourfulJoker, CardType.ColourlessJoker].includes(this.type);
    }

    public Compare(other: Card): ComparisonResultType {
        let difference = this.Difference(other);
        return difference > 0 ? +1 : difference < 0 ? -1 : difference == 0 ? 0 : null;
    }

    public Difference(other: Card): number | null {
        if (this.isJoker || other.isJoker) { return null; }

        const VALUE: number = Object.values(CardDigit).indexOf(this.digit),
            OTHER_VALUE: number = Object.values(CardDigit).indexOf(other.digit);

        return VALUE - OTHER_VALUE;
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