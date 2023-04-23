import React, { useEffect, useRef, useContext } from "react";

import { Deck } from "../Classes/Card";
import CardType from "../Classes/CardType";
import CardDigit from "../Classes/CardDigit";
import { GameboardContext } from "../Gameboard/Gameboard";
import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";

import "./Header.scss";

const SMALL_DENSITY_PERCENTAGE: number = 0.5,
    MINIMUM_WINNING_TIMEOUT: number = 1000;

export default function Header() {
    const state = useContext(GameboardContext);

    const PLACEHOLDER_ELEMENT_CONTAINER_REF = useRef<HTMLElement>();

    useEffect(() => {
        CheckWinnigState();
    }, [
        ...state.solitaireManager.foundationPiles.map(foundationPile =>
            foundationPile.length),
    ]);

    function DeckClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        state.DrawFromDeck();
        state.DeselectCard();
        UpdateDeckElementZIndex();
    }

    function UpdateDeckElementZIndex(): void {
        const DECK_ELEMENT: HTMLElement =
            (PLACEHOLDER_ELEMENT_CONTAINER_REF.current as HTMLElement).firstElementChild as HTMLElement;

        DECK_ELEMENT.style.zIndex = state.solitaireManager.deck.length > 0 ? "1" : "0";
    }

    function CheckWinnigState(): void {
        const CARD_COUNT: number =
            Deck.filter(card =>
                !card.type.toString().includes("Joker")).length /
            Object.values(CardType).filter(cardType =>
                !cardType.toString().includes("Joker")).length;

        if (state.solitaireManager.foundationPiles.some(foundationPile =>
            foundationPile.length < CARD_COUNT)) { return; }

        setTimeout(() => {
            alert("Congratulations! You actually managed to won!");
        }, MINIMUM_WINNING_TIMEOUT);
    }

    return (
        <header id="gameboard-header">
            <section ref={PLACEHOLDER_ELEMENT_CONTAINER_REF}>
                <CardPlaceholderElement
                    type="deck"
                    useLighterTone={true}
                    isDeckPlaceholder={true}
                    placedCards={state.solitaireManager.deck}
                    densityPercentage={SMALL_DENSITY_PERCENTAGE}
                    permenantFirstUnflippedCardIndex={state.solitaireManager.deck.length}
                    isClickable={!state.selectedCard
                        && state.solitaireManager.deck.length == 0
                        && state.solitaireManager.reservedPiles.length > 0}
                    onClick={DeckClick}
                    onLastCardClick={DeckClick} />

                <CardPlaceholderElement
                    type="reservedPile"
                    orientation="horizontal"
                    permenantFirstUnflippedCardIndex={0}
                    placedCards={state.solitaireManager.reservedPiles}
                    permenantFirstClickableCardIndex={state.solitaireManager.reservedPiles.length - 1}
                    permenantFirstSelectableCardIndex={state.solitaireManager.reservedPiles.length - 1}
                    onLastCardClick={(e, placedCard) => state.SelectCard(placedCard)} />
            </section>

            <section> {
                Object.values(CardType)
                    .filter(cardType =>
                        !cardType.toString().includes("Joker"))
                    .map((cardType, i) =>
                        <CardPlaceholderElement
                            index={i}
                            cardType={cardType}
                            type="foundationPile"
                            placedCards={state.solitaireManager.foundationPiles[i]}
                            densityPercentage={SMALL_DENSITY_PERCENTAGE}
                            isClickable={state.selectedCard
                                && state.selectedCard.card.digit == CardDigit.Ace
                                && state.selectedCard.card.type == cardType
                                && state.solitaireManager.foundationPiles[i].length == 0}
                            onLastCardClick={(e, placedCard) => state.SelectCard(placedCard)}
                            onClick={e => state.MoveCardToEmptyPlaceholderCardElement(
                                "foundationPile", i)}
                            key={cardType} />)
            } </section>
        </header>
    );
}