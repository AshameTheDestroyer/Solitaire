import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Page.scss";
import CustomButton from "../CustomButton/CustomButton";

export default function Page() {
    return (
        <main id="page">
            <section>
                <CustomButton href="./Gameboard" text="Play" />
                <CustomButton href="./DeckDisplayer" text="Deck Displayer" />
            </section>
        </main>
    );
}