import Card, { Deck } from "./Card";

class SolitaireManager {
    public static Instance: SolitaireManager;

    public get Instance(): SolitaireManager {
        if (!SolitaireManager.Instance) {
            SolitaireManager.Instance = new SolitaireManager();
        }

        return SolitaireManager.Instance;
    }

    public Deck: Array<Card>;

    private constructor() {
        this.Deck = [...Deck];
    }

    public Start(): void {

    }

    public Reset(): void {
        SolitaireManager.Instance = new SolitaireManager();
    }
}