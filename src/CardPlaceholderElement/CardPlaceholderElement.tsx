import React, { useState, useEffect, useRef } from "react";

import Card from "../Classes/Card";
import CardType from "../Classes/CardType";
import CardElement from "../Card/CardElement";

import "./CardPlaceholderElement.scss";

export type PlaceholderType = "deck" | "reservedPile" | "foundationPile" | "playingPile";

export type PlacedCard = {
    card: Card;
    cardIndex: number;
    placeholderIndex: number;
    placeholderType: PlaceholderType;
};

type CardPlaceholderElementProps = {
    index?: number;
    cardType?: CardType;
    type: PlaceholderType;
    isClickable?: boolean;
    useLighterTone?: boolean;
    placedCards?: Array<Card>;
    densityPercentage?: number;
    isDeckPlaceholder?: boolean;
    animationRemovalTime?: number;
    orientation?: "vertical" | "horizontal";
    permenantFirstUnflippedCardIndex?: number;
    permenantFirstClickableCardIndex?: number;
    permenantFirstSelectableCardIndex?: number;

    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onLastCardClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, placedCard: PlacedCard) => void;
};

export default function CardPlaceholderElement({
    type,
    cardType,
    index = 0,
    placedCards = [],
    isClickable = false,
    animationRemovalTime,
    densityPercentage = 50,
    useLighterTone = false,
    orientation = "vertical",
    isDeckPlaceholder = false,
    permenantFirstUnflippedCardIndex = null,
    permenantFirstClickableCardIndex = null,
    permenantFirstSelectableCardIndex = null,

    onLastCardClick,
    onClick,
}: CardPlaceholderElementProps) {
    const [isAnimateable, setIsAnimateable] = useState(true);

    const [firstUnflippedCardIndex, setFirstUnflippedCardIndex] =
        useState(permenantFirstUnflippedCardIndex);
    const [firstClickableCardIndex, setFirstClickableCardIndex] =
        useState(permenantFirstClickableCardIndex);
    const [firstSelectableCardIndex, setFirstSelectableCardIndex] =
        useState(permenantFirstSelectableCardIndex);

    const CARD_PLACEHOLDER_ELEMENT = useRef<HTMLDivElement>();

    useEffect(() => SetAnimationRemovalTimer(), []);

    useEffect(() => {
        setFirstUnflippedCardIndex(
            permenantFirstUnflippedCardIndex ?? placedCards.length - 1);
        setFirstClickableCardIndex(
            permenantFirstClickableCardIndex ?? placedCards.length - 1);
        setFirstSelectableCardIndex(
            permenantFirstSelectableCardIndex ?? placedCards.length - 1);
    }, [
        placedCards.length,
        permenantFirstUnflippedCardIndex,
        permenantFirstClickableCardIndex,
        permenantFirstSelectableCardIndex,
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
                        isFlippable={false}
                        isFlipped={i < firstUnflippedCardIndex}
                        isClickable={i >= firstClickableCardIndex}
                        isSelectable={i >= firstSelectableCardIndex}
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