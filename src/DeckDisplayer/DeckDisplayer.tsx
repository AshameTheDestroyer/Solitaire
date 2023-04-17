import React, { useState, useEffect } from "react";

import { Deck } from "../Classes/Card";
import CardElement from "../Card/CardElement";
import "../Classes/GroupByImplementaion";

import "./DeckDisplayer.scss";

export default function DeckDisplayer() {
    return (
        <main id="deck-displayer"> {
            Array.from(Deck.groupBy(card => card.type))
                .map(([cardType, cards]) =>
                    <section key={cardType}>
                        <h1>{cardType}</h1>
                        <div> {
                            cards.map(card =>
                                <CardElement card={card} key={card.digit} />)
                        }
                        </div>
                    </section>
                )
        } </main>
    );
}