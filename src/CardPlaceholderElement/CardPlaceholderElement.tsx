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
    isLastCardSelectable?: boolean;
    orientation?: "vertical" | "horizontal";
    isAllUnflipped?: boolean;
    isClickable?: boolean;
    lastCardOnClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function CardPlaceholderElement({
    type,
    useLighterTone = false,
    isDeckPlaceholder = false,
    placedCards = [],
    densityPercentage = 50,
    isLastCardFlipped = false,
    isLastCardSelectable = true,
    orientation = "vertical",
    isAllUnflipped = false,
    isClickable = false,
    lastCardOnClick,
    onClick,
}: CardPlaceholderElementProps) {
    return (
        <div className={
            `card-placeholder-element ` +
            `${type?.toLowerCase()} ` +
            `${useLighterTone ? "lighter-tone" : ""} ` +
            `${isDeckPlaceholder ? "deck-placeholder" : ""} ` +
            `${orientation} ` +
            `${isClickable ? "clickable" : ""}`}

            style={{
                "--density": densityPercentage + "%",
            } as React.CSSProperties}

            onClick={e => isClickable && e.target == e.currentTarget && onClick(e)}>
            <figure />

            {
                placedCards.map((placedCard, i) =>
                    <CardElement
                        card={placedCard}
                        isFlipped={!isAllUnflipped && i != placedCards.length - 1 || isLastCardFlipped}
                        isFlippable={false}
                        isSelectable={i == placedCards.length - 1 && isLastCardSelectable}
                        isClickable={i == placedCards.length - 1}
                        onClick={e => i == placedCards.length - 1 && lastCardOnClick?.(e)}
                        key={i} />
                )
            }
        </div>
    );
}