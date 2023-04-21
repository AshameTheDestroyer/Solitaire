import Card, { Deck } from "./Card";
import CardType from "./CardType";

export default class SolitaireManager {
    public deck: Array<Card>;
    public foundationPiles: Array<Array<Card>>;
    public playingPiles: Array<Array<Card>>;
    public reservedPiles: Array<Card>;

    public static readonly FOUNDATION_PILE_COUNT: number = 4;
    public static readonly PLAYING_PILE_COUNT: number = 7;
    public static readonly CARD_DRAWING_COUNT: number = 3;

    public constructor() {
        this.Reset();
    }

    public Start(): void {
        this.Reset();

        this.ShuffleDeck();
        this.DistributeDeck();
    }

    public Reset(): void {
        this.deck = [...Deck].filter(card =>
            !card.type.toString().includes("Joker"));

        this.foundationPiles = new Array<Array<Card>>(
            SolitaireManager.FOUNDATION_PILE_COUNT)
            .fill([])
            .map(_ => new Array<Card>());

        this.playingPiles = new Array<Array<Card>>(
            SolitaireManager.PLAYING_PILE_COUNT)
            .fill([])
            .map(_ => new Array<Card>());

        this.reservedPiles = new Array<Card>();
    }

    private ShuffleDeck(): void {
        this.deck.sort(() => Math.random() - 0.5);
    }

    private DistributeDeck(): void {
        for (let i: number = 0; i < SolitaireManager.PLAYING_PILE_COUNT; i++) {
            for (let j: number = i; j < SolitaireManager.PLAYING_PILE_COUNT; j++) {
                let card: Card | undefined = this.deck.pop();
                if (card == undefined) { break; }

                this.playingPiles[j]?.push(card);
            }
        }
    }

    public DrawFromDeck(count: number = SolitaireManager.CARD_DRAWING_COUNT,
        isUnshifting = false): void {
        if (!this.deck.length) {
            if (!this.reservedPiles.length) { return; }

            this.deck.push(...this.reservedPiles.reverse());

            this.reservedPiles =
                this.reservedPiles.filter(() => false);

            return;
        }

        for (let i: number = 0; i < count; i++) {
            let card: Card | undefined = this.deck.pop();
            if (card == undefined) { break; }

            if (!isUnshifting) {
                this.reservedPiles.push(card);

                continue;
            }

            this.reservedPiles.unshift(card);
        }
    }

    public DrawFromReservedPile(playingPileIndex: number): void {
        let card: Card | undefined = this.reservedPiles.pop();
        if (card == undefined) { return; }

        this.playingPiles[playingPileIndex].push(card);

        if (this.reservedPiles.length < SolitaireManager.CARD_DRAWING_COUNT) {
            this.DrawFromDeck(1, true);
        }
    }

    public MoveFromFoundationPile(foundationPileIndex: number, playingPileIndex: number): void {
        let card: Card | undefined = this.foundationPiles[foundationPileIndex].pop();
        if (card == undefined) { return; }

        this.playingPiles[playingPileIndex].push(card);
    }

    public MoveFromPlayingPile(firstIndex: number, secondIndex: number, cardIndex: number): void {
        if (firstIndex == secondIndex) { return; }

        this.playingPiles[secondIndex].push(
            ...this.playingPiles[firstIndex].slice(cardIndex));

        this.playingPiles[firstIndex] =
            this.playingPiles[firstIndex].filter((_, i) => i < cardIndex);
    }

    public ClaimFromReservedPile(): void {
        let card: Card | undefined = this.reservedPiles.pop();
        if (card == undefined) { return; }

        let foundationPileIndex: number = Object.values(CardType).indexOf(card.type);
        this.foundationPiles[foundationPileIndex].push(card);

        if (this.reservedPiles.length < SolitaireManager.CARD_DRAWING_COUNT) {
            this.DrawFromDeck(1, true);
        }
    }

    public ClaimFromPlayingPile(playingPileIndex: number) {
        let card: Card | undefined = this.playingPiles[playingPileIndex].pop();
        if (card == undefined) { return; }

        let foundationPileIndex: number = Object.values(CardType).indexOf(card.type);
        this.foundationPiles[foundationPileIndex].push(card);
    }
}