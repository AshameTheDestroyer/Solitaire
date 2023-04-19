import React, { useState, useEffect } from "react";

import Header from "../Header/Header";
import PlayingSection from "../PlayingSection/PlayingSection";
import Footer from "../Footer/Footer";
import SolitaireManager from "../Classes/SolitaireManager";

import "./Gameboard.scss";

export default function Gameboard() {
    useEffect(() => SolitaireManager.Start(), []);

    return (
        <main id="gameboard">
            <Header />
            <PlayingSection />
            <Footer />
        </main>
    );
}