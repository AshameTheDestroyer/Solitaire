import React, { useState, useEffect, useContext } from "react";

import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";
import { GameboardContext } from "../Gameboard/Gameboard";
import CardDigit from "../Classes/CardDigit";
import SolitaireManager from "../Classes/SolitaireManager";

import "./PlayingSection.scss";

const CARD_ANIMATION_DELAY: number = 350;

export default function PlayingSection() {
    const state = useContext(GameboardContext);

    const [playingPileLengths, setPlayingPileLengths] = useState<Array<number>>([]);
    const [playingPileShownCardCounts, setPlayingPileShownCardCounts] = useState<Array<number>>(
        new Array<number>(SolitaireManager.PLAYING_PILE_COUNT).fill(-1));

    useEffect(() => {
        setPlayingPileLengths(() =>
            state.solitaireManager.playingPiles.map(
                playingPile => playingPile.length)
        );
    }, [
        ...state.solitaireManager.playingPiles.map(
            playingPile => playingPile.length),
    ]);

    useEffect(() => {
        let playingPileShownCardCounts_: Array<number> = [...playingPileShownCardCounts];

        playingPileLengths.forEach((playingPileLength, i) => {
            if (playingPileShownCardCounts_[i] == -1 && playingPileLength > 0) {
                playingPileShownCardCounts_[i] = playingPileLength;

                return;
            }

            if (playingPileLength >= playingPileShownCardCounts_[i]) { return; }

            playingPileShownCardCounts_[i] = playingPileLength;
        });

        setPlayingPileShownCardCounts([...playingPileShownCardCounts_]);
    }, [playingPileLengths]);

    useEffect(() => {
        if (!playingPileLengths.some((playingPileLength, i) =>
            playingPileLength != i + 1)) { return; }

        setPlayingPileShownCardCounts(
            new Array<number>(SolitaireManager.PLAYING_PILE_COUNT).fill(-1));
    }, [state.solitaireManager.deck]);

    return (
        <main id="playing-section" style={{
            "--delay": `${CARD_ANIMATION_DELAY}ms`,
        } as React.CSSProperties}>
            <section> {
                state.solitaireManager.playingPiles.map((playingPile, i) =>
                    <CardPlaceholderElement
                        type="playingPile"
                        index={i}
                        useLighterTone={true}
                        placedCards={playingPile}
                        densityPercentage={30}
                        isClickable={state.selectedCard
                            && state.selectedCard.card.digit == CardDigit.King
                            && playingPile.length == 0}
                        animationRemovalTime={CARD_ANIMATION_DELAY * SolitaireManager.PLAYING_PILE_COUNT * 2}
                        permenantFirstUnflippedCardIndex={playingPileShownCardCounts[i] - 1}
                        permenantFirstSelectableCardIndex={playingPileShownCardCounts[i] - 1}
                        permenantFirstClickableCardIndex={playingPileShownCardCounts[i] - 1}
                        onLastCardClick={(e, placedCard) => state.SelectCard(placedCard)}
                        onClick={e => state.MoveCardToEmptyPlaceholderCardElement(
                            "playingPile", i)}
                        key={i} />
                )
            } </section>
        </main>
    );
}