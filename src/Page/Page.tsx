import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Page.scss";
import LinkButton from "../LinkButton/LinkButton";

export default function Page() {
    return (
        <main id="page">
            <section>
                <LinkButton href="./Gameboard" text="Play" />
                <LinkButton href="./DeckDisplayer" text="Deck Displayer" />
            </section>
        </main>
    );
}