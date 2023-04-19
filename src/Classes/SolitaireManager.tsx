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

    public static readonly FOUNDATION_PILE_COUNT = 4;
    public static readonly PLAYING_PILE_COUNT = 7;

    private constructor() {
        this.deck = [...Deck];

        this.foundationPiles = new Array<Array<Card>>(
            SolitaireManager.FOUNDATION_PILE_COUNT);

        this.playingPiles = new Array<Array<Card>>(
            SolitaireManager.PLAYING_PILE_COUNT);

        this.reservedPiles = new Array<Card>();
    }

    public static Start(): void {
        this.Instance.ShuffleDeck();
    }

    public static Reset(): void {
        SolitaireManager.instance = new SolitaireManager();
    }

    private ShuffleDeck(): void {
        this.deck.sort(() => Math.random() - 0.5);
    }
}