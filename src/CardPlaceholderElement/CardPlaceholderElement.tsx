import React, { useState, useEffect } from "react";

import "./CardPlaceholderElement.scss";
import CardType from "../Classes/CardType";
import Card from "../Classes/Card";
import CardElement from "../Card/CardElement";

type CardPlaceholderElementProps = {
    type?: CardType;
    useLighterTone?: boolean;
    isDeckPlaceholder?: boolean;
    placedCards?: Array<Card>;
    densityPercentage?: number;
    isLastCardFlipped?: boolean;
};

export default function CardPlaceholderElement({
    type,
    useLighterTone = false,
    isDeckPlaceholder = false,
    placedCards = [],
    densityPercentage = 50,
    isLastCardFlipped = false,
}: CardPlaceholderElementProps) {
    return (
        <div className={
            `card-placeholder-element ` +
            `${type?.toLowerCase()} ` +
            `${useLighterTone ? "lighter-tone" : ""} ` +
            `${isDeckPlaceholder ? "deck-placeholder" : ""}`}

            style={{
                "--density": densityPercentage + "%",
            } as React.CSSProperties}>
            <figure />

            {
                placedCards
                    .map((placedCard, i) =>
                        <CardElement
                            card={placedCard}
                            isFlipped={i != placedCards.length - 1
                                || isLastCardFlipped}
                            isFlippable={false}
                            key={i} />
                    )
            }
        </div>
    );
}