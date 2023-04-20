import React, { useState, useEffect, useRef } from "react";

import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";
import CardType from "../Classes/CardType";
import SolitaireManager from "../Classes/SolitaireManager";
import Card from "../Classes/Card";

import "./Header.scss";

export default function Header() {
    const SMALL_DENSITY_PERCENTAGE: number = 0.5;

    const [deck, setDeck] = useState(new Array<Card>());
    const [reservedPiles, setReservedPiles] = useState(new Array<Card>());
    const PLACEHOLDER_ELEMENT_CONTAINER_REF = useRef();

    useEffect(() => {
        setDeck([...SolitaireManager.Instance.deck]);
    }, [SolitaireManager.Instance.deck]);

    useEffect(() => UpdateDeckElementZIndex(), [deck]);

    function DeckClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        SolitaireManager.Instance.DrawCards();
        setDeck([...SolitaireManager.Instance.deck]);
        setReservedPiles([...SolitaireManager.Instance.reservedPiles]);
    }

    function UpdateDeckElementZIndex(): void {
        const DECK_ELEMENT: HTMLElement =
            (PLACEHOLDER_ELEMENT_CONTAINER_REF.current as HTMLElement)
                .firstElementChild as HTMLElement;

        DECK_ELEMENT.style.zIndex = deck.length > 0 ? "1" : "0";
    }

    return (
        <header id="gameboard-header">
            <section ref={PLACEHOLDER_ELEMENT_CONTAINER_REF}>
                <CardPlaceholderElement
                    isDeckPlaceholder={true}
                    useLighterTone={true}
                    placedCards={deck}
                    densityPercentage={SMALL_DENSITY_PERCENTAGE}
                    isLastCardFlipped
                    isLastCardSelectable={false}
                    isClickable={deck.length + reservedPiles.length > 0}
                    lastCardOnClick={DeckClick}
                    onClick={DeckClick} />

                <CardPlaceholderElement
                    placedCards={reservedPiles}//.slice(-SolitaireManager.CARD_DRAWING_COUNT)}
                    orientation="horizontal"
                    isAllUnflipped />
            </section>

            <section> {
                Object.values(CardType)
                    .filter(cardType =>
                        !cardType.toString().includes("Joker"))
                    .map(cardType =>
                        <CardPlaceholderElement
                            type={cardType}
                            densityPercentage={SMALL_DENSITY_PERCENTAGE}
                            key={cardType} />)
            } </section>
        </header>
    );
}