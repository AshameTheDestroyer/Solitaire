import React, { useState, useEffect } from "react";

import "./PlayingSection.scss";
import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";
import SolitaireManager from "../Classes/SolitaireManager";

export default function PlayingSection() {
    return (
        <main id="playing-section">
            <section> {
                Array(SolitaireManager.PLAYING_PILE_COUNT)
                    .fill(null)
                    .map((_, i) =>
                        <CardPlaceholderElement useLighterTone={true} key={i} />)
            } </section>
        </main>
    );
}