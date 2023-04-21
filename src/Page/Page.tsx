import { useContext } from "react";

import { MainContext } from "../main";
import CustomButton from "../CustomButton/CustomButton";

import "./Page.scss";

export default function Page() {
    const state = useContext(MainContext);

    return (
        <main id="page">
            <section>
                <CustomButton text="Play" href="./Gameboard" />
                <CustomButton text="Deck Displayer" href="./DeckDisplayer" />

                <CustomButton
                    text={`Toggle to ${state.isDarkThemed ? "Light Theme" : "Dark Theme"}`}
                    isStatic
                    onClick={e => state.ToggleDarkTheme()} />
            </section>
        </main>
    );
}