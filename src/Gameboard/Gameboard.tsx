import { useState, useEffect, createContext } from "react";

import Card from "../Classes/Card";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import CardDigit from "../Classes/CardDigit";
import CommandManager from "../Classes/CommandManager";
import SolitaireManager from "../Classes/SolitaireManager";
import PlayingSection from "../PlayingSection/PlayingSection";
import { PlacedCard, PlaceholderType } from "../CardPlaceholderElement/CardPlaceholderElement";

import "./Gameboard.scss";

type GameboardStateProps = {
    commandManager: CommandManager;
    selectedCard: PlacedCard | null;
    playingPileLengths: Array<number>;
    solitaireManager: SolitaireManager;
    playingPileShownCardCounts: Array<number>;

    Undo: () => void;
    Redo: () => void;
    Reset: () => void;
    DrawFromDeck: () => void;
    DeselectCard: () => void;
    SelectCard: (placedCard: PlacedCard) => void;
    setPlayingPileLengths: (setter: (previousValue: Array<number>) => Array<number>) => void;
    setPlayingPileShownCardCounts: (setter: (previousValue: Array<number>) => Array<number>) => void;
    MoveCardToEmptyCardPlaceholderElement: (placeholderType: PlaceholderType, placeholderIndex?: number) => void;
};

export const GameboardContext = createContext<GameboardStateProps>(null);

const PlaceableCardPlaceholderTypes: Array<PlaceholderType> = [
    "playingPile",
    "foundationPile",
];

export default function Gameboard() {
    const [state, setState] = useState<GameboardStateProps>({
        selectedCard: null,
        commandManager: CommandManager.Instance,
        solitaireManager: SolitaireManager.Instance,
        playingPileLengths: new Array(SolitaireManager.PLAYING_PILE_COUNT).fill(-1),
        playingPileShownCardCounts: new Array(SolitaireManager.PLAYING_PILE_COUNT).fill(-1),

        Undo,
        Redo,
        Reset,
        SelectCard,
        DeselectCard,
        DrawFromDeck,
        setPlayingPileLengths,
        setPlayingPileShownCardCounts,
        MoveCardToEmptyCardPlaceholderElement,
    });

    useEffect(() => Reset(), []);

    function Reset(): void {
        state.solitaireManager.Start();
        CommandManager.Instance.Reset();

        state.selectedCard = null;

        setState({ ...state });

        const MINIMUM_TIMEOUT = 10;
        setTimeout(() => ResetCardFlippedStates(), MINIMUM_TIMEOUT);
    }

    function SelectCard(placedCard: PlacedCard): void {
        if (UpdateCardPlace(placedCard)) { DeselectCard(); return; }

        state.selectedCard = state.selectedCard
            && state.selectedCard.card == placedCard.card ? null : placedCard;

        setState({ ...state });
    }

    function DeselectCard(): void {
        setTimeout(() => {
            document.querySelector(".card-element.selected")
                ?.classList.remove("selected");
        });

        state.selectedCard = null;
        setState({ ...state });
    }

    function DrawFromDeck(): void {
        let deck: Array<Card> = [...state.solitaireManager.deck],
            reservedCards: Array<Card> = [...state.solitaireManager.reservedCards];

        CommandManager.Instance.Invoke({
            Action: () => state.solitaireManager.DrawFromDeck(),
            ReversedAction: () => {
                state.solitaireManager.deck = [...deck];
                state.solitaireManager.reservedCards = [...reservedCards];
            },
        });

        setState({ ...state });
    }

    function MoveCardToEmptyCardPlaceholderElement(
        placeholderType: PlaceholderType, placeholderIndex: number = 0): void {
        let selectedCard: PlacedCard = state.selectedCard;

        if (!PlaceableCardPlaceholderTypes.includes(placeholderType)) { return; }
        if (!selectedCard) { return; }

        switch (placeholderType) {
            case "foundationPile":
                if (selectedCard.card.digit != CardDigit.Ace) { return; }
                break;

            case "playingPile":
                if (selectedCard.card.digit != CardDigit.King) { return; }
                break;
        }

        switch (selectedCard.placeholderType) {
            case "foundationPile":
                CommandManager.Instance.Invoke({
                    Action: () =>
                        state.solitaireManager.MoveFromFoundationPile(
                            selectedCard.placeholderIndex,
                            placeholderIndex),

                    ReversedAction: () =>
                        state.solitaireManager.ClaimFromPlayingPile(
                            selectedCard.placeholderIndex),
                });
                break;

            case "reservedCards":
                let reservedCards: Array<Card> = [...state.solitaireManager.reservedCards];

                switch (placeholderType) {
                    case "foundationPile":
                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.ClaimFromReservedCards(),

                            ReversedAction: () => {
                                state.solitaireManager.reservedCards = [...reservedCards];
                                state.solitaireManager.foundationPiles[placeholderIndex] = [];
                            },
                        });
                        break;

                    case "playingPile":
                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.DrawFromReservedCards(
                                    placeholderIndex),

                            ReversedAction: () => {
                                state.solitaireManager.reservedCards = [...reservedCards];
                                state.solitaireManager.playingPiles[placeholderIndex] = [];
                            },
                        });
                        break;
                } break;

            case "playingPile":
                switch (placeholderType) {
                    case "foundationPile":
                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.ClaimFromPlayingPile(
                                    selectedCard.placeholderIndex),

                            ReversedAction: () => {
                                state.solitaireManager.MoveFromFoundationPile(
                                    placeholderIndex,
                                    selectedCard.placeholderIndex);

                                state.playingPileShownCardCounts[selectedCard.placeholderIndex]++;
                            },
                        });
                        break;

                    case "playingPile":
                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.MoveFromPlayingPile(
                                    selectedCard.placeholderIndex,
                                    placeholderIndex,
                                    selectedCard.cardIndex),

                            ReversedAction: () => {
                                state.solitaireManager.MoveFromPlayingPile(
                                    placeholderIndex,
                                    selectedCard.placeholderIndex, 0);

                                state.playingPileShownCardCounts[selectedCard.placeholderIndex]++;
                            },
                        });
                        break;
                } break;
        }

        DeselectCard();
        setState({ ...state });
    }

    function UpdateCardPlace(placedCard: PlacedCard): boolean {
        let selectedCard: PlacedCard = state.selectedCard;

        if (!PlaceableCardPlaceholderTypes.includes(placedCard.placeholderType)) { return; }
        if (!selectedCard) { return false; }

        switch (placedCard.placeholderType) {
            case "foundationPile":
                if (selectedCard.card.type != placedCard.card.type) { return false; }
                if (selectedCard.card.Difference(placedCard.card) != +1) { return false; }
                if (selectedCard.placeholderType == "playingPile" &&
                    selectedCard.card != state.solitaireManager.playingPiles[
                        selectedCard.placeholderIndex].at(-1)) { return; }
                break;

            case "playingPile":
                let lastCard: Card =
                    state.solitaireManager.playingPiles[placedCard.placeholderIndex].at(-1);

                if (selectedCard.card.colour == lastCard.colour) { return false; }
                if (selectedCard.card.Difference(lastCard) != -1) { return false; }
                break;
        }

        switch (selectedCard.placeholderType) {
            case "foundationPile":
                CommandManager.Instance.Invoke({
                    Action: () =>
                        state.solitaireManager.MoveFromFoundationPile(
                            selectedCard.placeholderIndex,
                            placedCard.placeholderIndex),

                    ReversedAction: () =>
                        state.solitaireManager.ClaimFromPlayingPile(
                            placedCard.placeholderIndex),
                });
                break;

            case "reservedCards":
                let reservedCards: Array<Card> = [...state.solitaireManager.reservedCards];

                switch (placedCard.placeholderType) {
                    case "foundationPile":
                        let foundationPile: Array<Card> =
                            [...state.solitaireManager.foundationPiles[placedCard.placeholderIndex]];

                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.ClaimFromReservedCards(),

                            ReversedAction: () => {
                                state.solitaireManager.reservedCards = [...reservedCards];
                                state.solitaireManager.foundationPiles[placedCard.placeholderIndex] =
                                    [...foundationPile];
                            },
                        });
                        break;

                    case "playingPile":
                        let playingPile: Array<Card> =
                            [...state.solitaireManager.playingPiles[placedCard.placeholderIndex]];

                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.DrawFromReservedCards(
                                    placedCard.placeholderIndex),

                            ReversedAction: () => {
                                state.solitaireManager.reservedCards = [...reservedCards];
                                state.solitaireManager.playingPiles[placedCard.placeholderIndex] =
                                    [...playingPile];
                            },
                        });
                        break;
                } break;

            case "playingPile":
                let wasCardFirstShown: boolean =
                    selectedCard.cardIndex == state.playingPileShownCardCounts[
                    selectedCard.placeholderIndex] - 1;

                switch (placedCard.placeholderType) {
                    case "foundationPile":
                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.ClaimFromPlayingPile(
                                    selectedCard.placeholderIndex),

                            ReversedAction: () => {
                                state.solitaireManager.MoveFromFoundationPile(
                                    placedCard.placeholderIndex,
                                    selectedCard.placeholderIndex);

                                if (!wasCardFirstShown) { return; }
                                state.playingPileShownCardCounts[selectedCard.placeholderIndex]++;
                            },
                        });
                        break;

                    case "playingPile":
                        let cardIndex = state.solitaireManager.playingPiles[
                            placedCard.placeholderIndex].length;

                        CommandManager.Instance.Invoke({
                            Action: () =>
                                state.solitaireManager.MoveFromPlayingPile(
                                    selectedCard.placeholderIndex,
                                    placedCard.placeholderIndex,
                                    selectedCard.cardIndex),

                            ReversedAction: () => {
                                state.solitaireManager.MoveFromPlayingPile(
                                    placedCard.placeholderIndex,
                                    selectedCard.placeholderIndex,
                                    cardIndex);

                                if (!wasCardFirstShown) { return; }
                                state.playingPileShownCardCounts[selectedCard.placeholderIndex]++;
                            },
                        });
                        break;
                } break;
        }

        setState({ ...state });
        return true;
    }

    function ResetCardFlippedStates(): void {
        document.querySelectorAll(".card-element:not(:last-of-type):not(.flipped)")
            .forEach(cardElement =>
                cardElement.classList.add("flipped"));
    }

    function Undo(): void {
        CommandManager.Instance.Undo();
        setState({ ...state });
    }

    function Redo(): void {
        CommandManager.Instance.Redo();
        setState({ ...state });
    }

    function setPlayingPileLengths(setter: (previousValue: Array<number>) => Array<number>): void {
        state.playingPileLengths =
            setter(state.playingPileLengths);

        setState({ ...state });
    }

    function setPlayingPileShownCardCounts(setter: (previousValue: Array<number>) => Array<number>): void {
        state.playingPileShownCardCounts =
            setter(state.playingPileShownCardCounts);

        setState({ ...state });
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