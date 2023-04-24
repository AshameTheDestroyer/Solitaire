import CardType from "./CardType";
import Card, { Deck } from "./Card";

export default class SolitaireManager {
    private static instance: SolitaireManager;

    public static get Instance(): SolitaireManager {
        return this.instance ??= new SolitaireManager();
    }

    public deck: Array<Card>;
    public reservedCards: Array<Card>;
    public playingPiles: Array<Array<Card>>;
    public foundationPiles: Array<Array<Card>>;

    public static readonly PLAYING_PILE_COUNT: number = 7;
    public static readonly CARD_DRAWING_COUNT: number = 3;
    public static readonly FOUNDATION_PILE_COUNT: number = 4;

    private constructor() {
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

        this.reservedCards = new Array<Card>();
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
            if (!this.reservedCards.length) { return; }

            this.deck.push(...this.reservedCards.reverse());

            this.reservedCards =
                this.reservedCards.filter(() => false);

            return;
        }

        for (let i: number = 0; i < count; i++) {
            let card: Card | undefined = this.deck.pop();
            if (card == undefined) { break; }

            if (!isUnshifting) {
                this.reservedCards.push(card);

                continue;
            }

            this.reservedCards.unshift(card);
        }
    }

    public DrawFromReservedCards(playingPileIndex: number): void {
        let card: Card | undefined = this.reservedCards.pop();
        if (card == undefined) { return; }

        this.playingPiles[playingPileIndex].push(card);

        if (this.reservedCards.length < SolitaireManager.CARD_DRAWING_COUNT) {
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

    public ClaimFromReservedCards(): void {
        let card: Card | undefined = this.reservedCards.pop();
        if (card == undefined) { return; }

        let foundationPileIndex: number = Object.values(CardType).indexOf(card.type);
        this.foundationPiles[foundationPileIndex].push(card);

        if (this.reservedCards.length < SolitaireManager.CARD_DRAWING_COUNT) {
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