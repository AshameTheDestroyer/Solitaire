import Card, { Deck } from "./Card";

export default class SolitaireManager {
    private static instance: SolitaireManager;

    public static get Instance(): SolitaireManager {
        if (!SolitaireManager.instance) {
            SolitaireManager.instance = new SolitaireManager();
        }

        return SolitaireManager.instance;
    }

    public deck: Array<Card>;
    public foundationPiles: Array<Array<Card>>;
    public playingPiles: Array<Array<Card>>;
    public reservedPiles: Array<Card>;

    public static readonly FOUNDATION_PILE_COUNT: number = 4;
    public static readonly PLAYING_PILE_COUNT: number = 7;
    public static readonly CARD_DRAWING_COUNT: number = 3;

    private constructor() {
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

    public static Start(): void {
        this.Reset();

        this.Instance.ShuffleDeck();
        this.Instance.DistributeDeck();
    }

    public static Reset(): void {
        SolitaireManager.instance = new SolitaireManager();
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

    public DrawCards(): void {
        if (!this.deck.length) {
            this.deck.push(...this.reservedPiles.reverse());

            this.reservedPiles =
                this.reservedPiles.filter(() => false);

            return;
        }

        for (let i: number = 0; i < SolitaireManager.CARD_DRAWING_COUNT; i++) {
            let card: Card | undefined = this.deck.pop();
            if (card == undefined) { break; }

            this.reservedPiles.push(card);
        }
    }
}