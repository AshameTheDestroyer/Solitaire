import { useContext } from "react";

import { MainContext } from "../main";
import { Deck } from "../Classes/Card";
import CardType from "../Classes/CardType";
import CardElement from "../Card/CardElement";
import CustomButton from "../CustomButton/CustomButton";

import "./Page.scss";

export default function Page() {
    return (
        <main id="page">
            <LandingSection />
        </main>
    );
}

function LandingSection() {
    return (
        <main id="landing-section">
            <ThemeTogglingButton />

            <BigFigure />
            <WelcomingSection />
        </main>
    );
}

function ThemeTogglingButton() {
    const state = useContext(MainContext);

    return (
        <button id="theme-toggling-button"
            className={`${state.isDarkThemed ? "dark" : "light"}-themed-button`}
            title={`Toggles the theme into ${state.isDarkThemed ? "Light" : "Dark"} Mode.`}
            onClick={e => state.ToggleDarkTheme()} />
    );
}

function BigFigure() {
    return (
        <figure> {
            Object.values(CardType)
                .filter(cardType =>
                    !cardType.toString().includes("Joker"))
                .sort(() => Math.random() - 0.5)
                .map((cardType, i) =>
                    <div className="card-container" key={i}>
                        <CardElement
                            card={Deck.filter(card => card.type == cardType)[
                                ~~(Math.random() * Deck.filter(card =>
                                    card.type == cardType).length)]}
                            isSelectable={false}
                            isAdaptable={false} />
                    </div>
                )
        } </figure>
    );
}

function WelcomingSection() {
    return (
        <section id="welcoming-section">
            <h1>Welcome to <q>Solitaire</q></h1>

            <h3>Best way to sharpen up your thinking skills!</h3>

            <p>
                How about spending your next fifteen minutes on
                a <q>Solitaire Game</q> so you can feel those braincells
                working once again?
            </p>

            <div className="button-displayer">
                <CustomButton className="emphasized-button arrowed-button" text="Play now" href="./Gameboard" />
                <CustomButton text="Deck Displayer" href="./DeckDisplayer" />
            </div>
        </section>
    );
}
