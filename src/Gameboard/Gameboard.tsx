import { useState, useEffect, createContext } from "react";

import Card from "../Classes/Card";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import CardDigit from "../Classes/CardDigit";
import SolitaireManager from "../Classes/SolitaireManager";
import PlayingSection from "../PlayingSection/PlayingSection";
import { PlacedCard, PlaceholderType } from "../CardPlaceholderElement/CardPlaceholderElement";

import "./Gameboard.scss";

type GameboardStateProps = {
    selectedCard: PlacedCard | null;
    solitaireManager: SolitaireManager;

    Reset: () => void;
    DrawFromDeck: () => void;
    DeselectCard: () => void;
    SelectCard: (placedCard: PlacedCard) => void;
    MoveCardToEmptyPlaceholderCardElement: (placeholderType: PlaceholderType, placeholderIndex?: number) => void;
};

export const GameboardContext = createContext<GameboardStateProps>(null);

const PlaceableCardPlaceholderTypes: Array<PlaceholderType> = [
    "playingPile",
    "foundationPile",
];

export default function Gameboard() {
    const [state, setState] = useState<GameboardStateProps>({
        selectedCard: null,
        solitaireManager: new SolitaireManager(),

        Reset,
        SelectCard,
        DeselectCard,
        DrawFromDeck,
        MoveCardToEmptyPlaceholderCardElement,
    });

    useEffect(() => Reset(), []);

    function Reset(): void {
        state.solitaireManager.Start();
        state.selectedCard = null;

        setState({
            ...state,
            solitaireManager: state.solitaireManager,
        });

        const MINIMUM_TIMEOUT = 10;
        setTimeout(() => ResetCardFlippedStates(), MINIMUM_TIMEOUT);
    }

    function SelectCard(placedCard: PlacedCard): void {
        if (UpdateCardPlace(placedCard)) { DeselectCard(); return; }

        state.selectedCard = state.selectedCard
            && state.selectedCard.card == placedCard.card ? null : placedCard;

        setState({
            ...state,
        });
    }

    function DeselectCard(): void {
        setTimeout(() => {
            document.querySelector(".card-element.selected")
                ?.classList.remove("selected");
        });

        state.selectedCard = null;
        setState({
            ...state,
        });
    }

    function DrawFromDeck(): void {
        state.solitaireManager.DrawFromDeck();
        setState({
            ...state,
            solitaireManager: state.solitaireManager,
        });
    }

    function MoveCardToEmptyPlaceholderCardElement(
        placeholderType: PlaceholderType, placeholderIndex: number = 0): void {
        if (!PlaceableCardPlaceholderTypes.includes(placeholderType)) { return; }
        if (!state.selectedCard) { return; }

        switch (placeholderType) {
            case "foundationPile":
                if (state.selectedCard.card.digit != CardDigit.Ace) { return; }
                break;

            case "playingPile":
                if (state.selectedCard.card.digit != CardDigit.King) { return; }
                break;
        }

        switch (state.selectedCard.placeholderType) {
            case "foundationPile":
                state.solitaireManager.MoveFromFoundationPile(
                    state.selectedCard.placeholderIndex,
                    placeholderIndex);
                break;

            case "reservedPile":
                switch (placeholderType) {
                    case "foundationPile":
                        state.solitaireManager.ClaimFromReservedPile();
                        break;

                    case "playingPile":
                        state.solitaireManager.DrawFromReservedPile(
                            placeholderIndex);
                        break;
                } break;

            case "playingPile":
                switch (placeholderType) {
                    case "foundationPile":
                        state.solitaireManager.ClaimFromPlayingPile(
                            state.selectedCard.placeholderIndex);
                        break;

                    case "playingPile":
                        state.solitaireManager.MoveFromPlayingPile(
                            state.selectedCard.placeholderIndex,
                            placeholderIndex,
                            state.selectedCard.cardIndex);
                        break;
                } break;
        }

        DeselectCard();

        setState({
            ...state,
            solitaireManager: state.solitaireManager,
        });
    }

    function UpdateCardPlace(placedCard: PlacedCard): boolean {
        if (!PlaceableCardPlaceholderTypes.includes(placedCard.placeholderType)) { return; }
        if (!state.selectedCard) { return false; }

        switch (placedCard.placeholderType) {
            case "foundationPile":
                if (state.selectedCard.card.type != placedCard.card.type) { return false; }
                if (state.selectedCard.card.Difference(placedCard.card) != +1) { return false; }
                if (state.selectedCard.placeholderType == "playingPile" &&
                    state.selectedCard.card !=
                    state.solitaireManager.playingPiles[state.selectedCard.placeholderIndex].at(-1)) { return; }
                break;

            case "playingPile":
                let lastCard: Card =
                    state.solitaireManager.playingPiles[placedCard.placeholderIndex].at(-1);

                if (state.selectedCard.card.colour == lastCard.colour) { return false; }
                if (state.selectedCard.card.Difference(lastCard) != -1) { return false; }
                break;
        }

        switch (state.selectedCard.placeholderType) {
            case "foundationPile":
                state.solitaireManager.MoveFromFoundationPile(
                    state.selectedCard.placeholderIndex,
                    placedCard.placeholderIndex);
                break;

            case "reservedPile":
                switch (placedCard.placeholderType) {
                    case "foundationPile":
                        state.solitaireManager.ClaimFromReservedPile();
                        break;

                    case "playingPile":
                        state.solitaireManager.DrawFromReservedPile(
                            placedCard.placeholderIndex);
                        break;
                } break;

            case "playingPile":
                switch (placedCard.placeholderType) {
                    case "foundationPile":
                        state.solitaireManager.ClaimFromPlayingPile(
                            state.selectedCard.placeholderIndex);
                        break;

                    case "playingPile":
                        state.solitaireManager.MoveFromPlayingPile(
                            state.selectedCard.placeholderIndex,
                            placedCard.placeholderIndex,
                            state.selectedCard.cardIndex);
                        break;
                } break;
        }

        setState({
            ...state,
            solitaireManager: state.solitaireManager,
        });

        return true;
    }

    function ResetCardFlippedStates(): void {
        document.querySelectorAll(".card-element:not(:last-of-type):not(.flipped)")
            .forEach(cardElement =>
                cardElement.classList.add("flipped"));
    }

    return (
        <GameboardContext.Provider value={state}>
            <main id="gameboard">
                <Header />
                <PlayingSection />
                <Footer />
            </main>
        </GameboardContext.Provider>
    );
}

window.addEventListener("beforeunload", e => {
    const GAMEBOARD = document.querySelector("#gameboard");
    if (GAMEBOARD == null) { return; }

    e.preventDefault();
    return (e.returnValue = "Are you sure you want to leave the page?");
}, { capture: true });