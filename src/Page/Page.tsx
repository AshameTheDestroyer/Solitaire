import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Page.scss";
import LinkButton from "../LinkButton/LinkButton";

export default function Page() {
    return (
        <main id="page">
            <LinkButton href="./DeckDisplayer" text="Deck Displayer" />
        </main>
    );
}