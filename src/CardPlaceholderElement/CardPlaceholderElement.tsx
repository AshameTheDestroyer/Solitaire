import React, { useState, useEffect, useRef } from "react";

import Card from "../Classes/Card";
import CardType from "../Classes/CardType";
import CardElement from "../Card/CardElement";

import "./CardPlaceholderElement.scss";

export type PlaceholderType = "deck" | "reservedPile" | "foundationPile" | "playingPile";

export type PlacedCard = {
    card: Card;
    placeholderType: PlaceholderType;
    placeholderIndex: number;
    cardIndex: number;
};

type CardPlaceholderElementProps = {
    type: PlaceholderType,
    index?: number;
    cardType?: CardType;
    useLighterTone?: boolean;
    isDeckPlaceholder?: boolean;
    placedCards?: Array<Card>;
    densityPercentage?: number;
    orientation?: "vertical" | "horizontal";
    isClickable?: boolean;
    animationRemovalTime?: number;
    permenantFirstUnflippedCardIndex?: number;
    permenantFirstSelectableCardIndex?: number;
    permenantFirstClickableCardIndex?: number;
    onLastCardClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, placedCard: PlacedCard) => void;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function CardPlaceholderElement({
    type,
    index = 0,
    cardType,
    useLighterTone = false,
    isDeckPlaceholder = false,
    placedCards = [],
    densityPercentage = 50,
    orientation = "vertical",
    isClickable = false,
    animationRemovalTime,
    permenantFirstUnflippedCardIndex = null,
    permenantFirstSelectableCardIndex = null,
    permenantFirstClickableCardIndex = null,
    onLastCardClick,
    onClick,
}: CardPlaceholderElementProps) {
    const [isAnimateable, setIsAnimateable] = useState(true);

    const [firstUnflippedCardIndex, setFirstUnflippedCardIndex] =
        useState(permenantFirstUnflippedCardIndex);
    const [firstSelectableCardIndex, setFirstSelectableCardIndex] =
        useState(permenantFirstSelectableCardIndex);
    const [firstClickableCardIndex, setFirstClickableCardIndex] =
        useState(permenantFirstClickableCardIndex);

    const CARD_PLACEHOLDER_ELEMENT = useRef<HTMLDivElement>();

    useEffect(() => {
        SetAnimationRemovalTimer();
    }, []);

    useEffect(() => {
        setFirstUnflippedCardIndex(
            permenantFirstUnflippedCardIndex ?? placedCards.length - 1);
        setFirstSelectableCardIndex(
            permenantFirstSelectableCardIndex ?? placedCards.length - 1);
        setFirstClickableCardIndex(
            permenantFirstClickableCardIndex ?? placedCards.length - 1);
    }, [
        placedCards.length,
        permenantFirstUnflippedCardIndex,
        permenantFirstSelectableCardIndex,
        permenantFirstClickableCardIndex,
    ]);

    function SetAnimationRemovalTimer(): void {
        if (!animationRemovalTime) { return; }

        setTimeout(() => {
            CARD_PLACEHOLDER_ELEMENT.current
                ?.classList.remove("animateable");

            setIsAnimateable(false);
        }, animationRemovalTime);
    }

    return (
        <div className={
            `card-placeholder-element ` +
            `${isAnimateable ? "animateable" : ""} ` +
            `${cardType?.toLowerCase() ?? ""} ` +
            `${useLighterTone ? "lighter-tone" : ""} ` +
            `${isDeckPlaceholder ? "deck-placeholder" : ""} ` +
            `${orientation} ` +
            `${isClickable ? "clickable" : ""}`}

            style={{
                "--density": densityPercentage + "%",
            } as React.CSSProperties}

            ref={CARD_PLACEHOLDER_ELEMENT}

            onClick={e => isClickable && e.target == e.currentTarget && onClick(e)}>
            <figure />

            {
                placedCards.map((placedCard, i) =>
                    <CardElement
                        card={placedCard}
                        placeholderType={type}
                        isFlipped={i < firstUnflippedCardIndex}
                        isFlippable={false}
                        isSelectable={i >= firstSelectableCardIndex}
                        isClickable={i >= firstClickableCardIndex}
                        onClick={e => onLastCardClick?.(e, {
                            card: placedCard,
                            placeholderType: type,
                            placeholderIndex: index,
                            cardIndex: i,
                        })}
                        key={i} />
                )
            }
        </div>
    );
}