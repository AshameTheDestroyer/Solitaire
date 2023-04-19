import React, { useState, useEffect } from "react";

import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";
import SolitaireManager from "../Classes/SolitaireManager";
import Card from "../Classes/Card";

import "./PlayingSection.scss";

export default function PlayingSection() {
    const [playingPiles, setPlayingPiles] = useState(new Array<Array<Card>>);

    useEffect(() => {
        setPlayingPiles([...SolitaireManager.Instance.playingPiles]);
    }, [SolitaireManager.Instance.playingPiles]);

    return (
        <main id="playing-section">
            <section> {
                playingPiles
                    .map((playingPile, i) =>
                        <CardPlaceholderElement
                            useLighterTone={true}
                            placedCards={playingPile}
                            densityPercentage={30}
                            key={i} />
                    )
            } </section>
        </main>
    );
}