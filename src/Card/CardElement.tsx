import React, { useState, useEffect } from "react";

import Card from "../Classes/Card";

import "./CardElement.scss";
import { PlaceholderType } from "../CardPlaceholderElement/CardPlaceholderElement";

type CardElementProps = {
    card: Card;
    placeholderType?: PlaceholderType;
    isFlipped?: boolean;
    isFlippable?: boolean;
    isSelected?: boolean;
    isSelectable?: boolean;
    isClickable?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function CardElement({
    card,
    isFlipped = false,
    isFlippable = true,
    isSelected = false,
    isSelectable = true,
    isClickable = true,
    onClick,
}: CardElementProps) {
    function CardElementClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        if (!isClickable) { return; }

        onClick?.(e);

        document.querySelectorAll(".card-element.selected")
            .forEach(cardElement =>
                cardElement != e.currentTarget &&
                cardElement.classList.remove("selected"));

        if (isFlippable) {
            e.currentTarget.classList.toggle("flipped");
        }

        if (isSelectable) {
            e.currentTarget.classList.toggle("selected");
        }
    }

    return (
        <div className={
            `card-element ` +
            `${card.colour.toLowerCase()} ` +
            `${card.type.toLowerCase()} ` +
            `${isFlipped ? "flipped" : ""} ` +
            `${isSelected ? "selected" : ""} ` +
            `${isClickable ? "clickable" : ""}`}

            data-digit={card.digit}
            onClick={CardElementClick}>
            <div className="corner">{card.digit}</div>
            <div className="corner">{card.digit}</div>

            <NumericFigureDisplayer card={card} />

            <figure />
        </div>
    );
}

type NumericFigureDisplayerProps = {
    card: Card;
};

function NumericFigureDisplayer({
    card
}: NumericFigureDisplayerProps) {
    return (
        <> {
            Array(3).fill(null).map((_, i) => {
                let isInMiddle: Boolean = i == 1,
                    count: Number = !isInMiddle ?
                        Math.min(~~(card.number / 2), 4) :
                        Math.max(card.number - ~~(card.number / 2) * 2, 0);

                switch (card.number) {
                    case 2: count = isInMiddle ? 2 : 0; break;
                    case 3: count = isInMiddle ? 3 : 0; break;
                    case 10: count = isInMiddle ? 2 : count; break;
                }

                if (Number.isNaN(card.number)) { return undefined; }

                return (
                    <div className={
                        "figure-container " +
                        `${isInMiddle && count == 1 && card.number != 7 ? "centred" : ""} ` +
                        `${isInMiddle && card.number == 7 ? "shortened-for-7" : ""} ` +
                        `${isInMiddle && card.number == 10 ? "shortened-for-10" : ""} ` +
                        `${isInMiddle && card.number == 1 ? "enlarged" : ""} ` +
                        `${isInMiddle && count == 3 ? "has-middle-figure" : ""}`
                    } key={i}> {
                            Array(count as number)
                                .fill(null)
                                .map((_, i) => <figure key={i} />)
                        }
                    </div>
                );
            })
        } </>
    );
}