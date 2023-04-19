import React, { useState, useEffect } from "react";

import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";
import CardType from "../Classes/CardType";
import SolitaireManager from "../Classes/SolitaireManager";
import Card from "../Classes/Card";

import "./Header.scss";

export default function Header() {
    const [deck, setDeck] = useState(new Array<Card>());

    useEffect(() => {
        setDeck([...SolitaireManager.Instance.deck]);
    }, [SolitaireManager.Instance.deck]);

    return (
        <header id="gameboard-header">
            <section>
                <CardPlaceholderElement
                    isDeckPlaceholder={true}
                    useLighterTone={true}
                    placedCards={deck}
                    densityPercentage={0.5}
                    isLastCardFlipped />

                <CardPlaceholderElement />
            </section>

            <section> {
                Object.values(CardType)
                    .filter(cardType =>
                        !cardType.toString().includes("Joker"))
                    .map(cardType =>
                        <CardPlaceholderElement type={cardType} key={cardType} />)
            } </section>
        </header>
    );
}