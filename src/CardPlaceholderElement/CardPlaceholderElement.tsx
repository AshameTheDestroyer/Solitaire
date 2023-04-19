import React, { useState, useEffect } from "react";

import "./CardPlaceholderElement.scss";
import CardType from "../Classes/CardType";

type CardPlaceholderElementProps = {
    type?: CardType;
    useLighterTone?: Boolean;
    isDeckPlaceholder?: Boolean;
};

export default function CardPlaceholderElement({
    type,
    useLighterTone = false,
    isDeckPlaceholder = false,
}: CardPlaceholderElementProps) {
    return (
        <div className={
            `card-placeholder-element ` +
            `${type?.toLowerCase()} ` +
            `${useLighterTone ? "lighter-tone" : ""} ` +
            `${isDeckPlaceholder ? "deck-placeholder" : ""}`}>
            <figure />
        </div>
    );
}