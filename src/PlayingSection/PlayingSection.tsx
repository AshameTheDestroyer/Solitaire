import React, { useEffect, useContext } from "react";

import CardDigit from "../Classes/CardDigit";
import { GameboardContext } from "../Gameboard/Gameboard";
import SolitaireManager from "../Classes/SolitaireManager";
import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";

import "./PlayingSection.scss";

const CARD_ANIMATION_DELAY: number = 350,
    SAFTEY_CARD_ANIMATION_DELAY: number = 250;

export default function PlayingSection() {
    const state = useContext(GameboardContext);

    useEffect(() => {
        state.setPlayingPileLengths(() =>
            state.solitaireManager.playingPiles.map(
                playingPile => playingPile.length));
    }, [...state.solitaireManager.playingPiles.map(
        playingPile => playingPile.length)]);

    useEffect(() => {
        let playingPileShownCardCounts_: Array<number> = [...state.playingPileShownCardCounts];

        state.playingPileLengths.forEach((playingPileLength, i) => {
            if (playingPileShownCardCounts_[i] == -1 && playingPileLength > 0) {
                playingPileShownCardCounts_[i] = playingPileLength;

                return;
            }

            if (playingPileLength >= playingPileShownCardCounts_[i]) { return; }

            playingPileShownCardCounts_[i] = playingPileLength;
        });

        state.setPlayingPileShownCardCounts(() => [...playingPileShownCardCounts_]);
    }, [state.playingPileLengths]);

    useEffect(() => {
        if (state.commandManager.canUndo ||
            !state.playingPileLengths.some((playingPileLength, i) =>
                playingPileLength != i + 1)) { return; }

        state.setPlayingPileShownCardCounts(() =>
            new Array<number>(SolitaireManager.PLAYING_PILE_COUNT).fill(-1));
    }, [state.solitaireManager.deck]);

    return (
        <main id="playing-section" style={{
            "--delay": `${CARD_ANIMATION_DELAY}ms`,
        } as React.CSSProperties}>
            <section> {
                state.solitaireManager.playingPiles.map((playingPile, i) =>
                    <CardPlaceholderElement
                        index={i}
                        type="playingPile"
                        useLighterTone={true}
                        densityPercentage={30}
                        placedCards={playingPile}
                        animationRemovalTime={CARD_ANIMATION_DELAY * SolitaireManager.PLAYING_PILE_COUNT
                            * 2 + SAFTEY_CARD_ANIMATION_DELAY}
                        isClickable={state.selectedCard
                            && state.selectedCard.card.digit == CardDigit.King
                            && playingPile.length == 0}
                        permenantFirstUnflippedCardIndex={state.playingPileShownCardCounts[i] - 1}
                        permenantFirstClickableCardIndex={state.playingPileShownCardCounts[i] - 1}
                        permenantFirstSelectableCardIndex={state.playingPileShownCardCounts[i] - 1}
                        onLastCardClick={(e, placedCard) => state.SelectCard(placedCard)}
                        onClick={e => state.MoveCardToEmptyCardPlaceholderElement(
                            "playingPile", i)}
                        key={i} />
                )
            } </section>
        </main>
    );
}