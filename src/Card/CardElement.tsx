import React, { useState, useEffect } from "react";

import Card from "../Classes/Card";

import "./CardElement.scss";
import CardDigit from "../Classes/CardDigit";

type CardElementProps = {
    card: Card
};

export default function CardElement({ card }: CardElementProps) {
    return (
        <div className={`card-element ${card.colour.toLowerCase()} ${card.type.toLowerCase()}`}
            data-digit={card.digit}
            onClick={e => e.currentTarget.classList.toggle("flipped")}>
            <div className="corner">{card.digit}</div>
            <div className="corner">{card.digit}</div>

            {
                !Number.isNaN(card.number) ?
                    <NumericFigureDisplayer card={card} /> :
                    <NonNumericFigureDisplayer card={card} />
            }
        </div>
    );
}

function NumericFigureDisplayer({
    card
}: CardElementProps) {
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

                return !Number.isNaN(card.number) ? (
                    <div className={
                        "figure-container " +
                        `${isInMiddle && count == 1 && card.number != 7 ? "centred" : ""} ` +
                        `${isInMiddle && card.number >= 7 ? "shortened-for-7" : ""} ` +
                        `${isInMiddle && card.number >= 10 ? "shortened-for-10" : ""} ` +
                        `${isInMiddle && card.number == 1 ? "enlarged" : ""} ` +
                        `${isInMiddle && count == 3 ? "has-middle-figure" : ""}`
                    } key={i}> {
                            Array(count as number)
                                .fill(null)
                                .map((_, i) => <figure key={i} />)
                        }
                    </div>
                ) : (<></>);
            })
        } </>
    );
}

function NonNumericFigureDisplayer({
    card
}: CardElementProps) {
    return card.digit != CardDigit.Joker ? (
        <>
            <div className="emphasized-text">{card.digit}</div>
            <div className="emphasized-text">{card.digit}</div>
        </>
    ) : (<div className="emphasized-text joker">XXX</div>);
}