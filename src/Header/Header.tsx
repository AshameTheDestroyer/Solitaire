import React, { useState, useEffect } from "react";

import "./Header.scss";
import CardPlaceholderElement from "../CardPlaceholderElement/CardPlaceholderElement";
import CardType from "../Classes/CardType";

export default function Header() {
    return (
        <header id="gameboard-header">
            <section>
                <CardPlaceholderElement isDeckPlaceholder={true} useLighterTone={true} />
                <CardPlaceholderElement />
            </section>

            <section>{
                Object.values(CardType)
                    .filter(cardType =>
                        !cardType.toString().includes("Joker"))
                    .map(cardType =>
                        <CardPlaceholderElement type={cardType} key={cardType} />)
            }
            </section>
        </header>
    );
}