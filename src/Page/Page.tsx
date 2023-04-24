import { useContext } from "react";

import { MainContext } from "../main";
import { Deck } from "../Classes/Card";
import CardElement from "../Card/CardElement";
import CardColour from "../Classes/CardColour";
import IconButton from "../IconButton/IconButton";
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
        <IconButton
            id="theme-toggling-button"
            title={`Toggles the theme into ${state.isDarkThemed ? "Light" : "Dark"} Mode.`}
            onClick={e => state.ToggleDarkTheme()} />
    );
}

function BigFigure() {
    return (
        <figure> {
            Object.values(CardColour)
                .map(cardColour => [cardColour, cardColour])
                .flat()
                .map(cardColour => Deck.filter(
                    card => card.colour == cardColour)[
                    ~~(Math.random() * Deck.filter(card =>
                        card.colour == cardColour).length)])
                .sort((card, otherCard) =>
                    card.isJoker ? 0 : otherCard.isJoker ? 1 : Math.random() - 0.5)
                .map((card, i) =>
                    <div className="card-container" key={i}>
                        <CardElement
                            isSelectable={false}
                            isAdaptable={false}
                            card={card} />
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
