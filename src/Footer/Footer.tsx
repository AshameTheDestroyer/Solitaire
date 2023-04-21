import React, { useState, useEffect, useContext } from "react";

import CustomButton from "../CustomButton/CustomButton";
import { GameboardContext } from "../Gameboard/Gameboard";

import "./Footer.scss";

const TIME_STRING_LENGTH = 8;

export default function Footer() {
    const state = useContext(GameboardContext);

    const [timer, setTimer] = useState(new Date("0"));
    const [timerIntervalID, setTimerIntervalID] = useState<number>();

    useEffect(() => {
        const FULL_SECOND = 1000;

        setTimer(new Date("0"));

        clearInterval(timerIntervalID);

        setTimerIntervalID(setInterval(() => {
            setTimer(previousValue => {
                let value = new Date(previousValue);
                value.setSeconds(value.getSeconds() + 1);

                return value;
            });
        }, FULL_SECOND));
    }, [state.solitaireManager.deck]);

    return (
        <footer id="gameboard-footer">
            <div id="timer"> {
                timer.toTimeString().substring(0, TIME_STRING_LENGTH)
            } </div>

            <section>
                <CustomButton text="Reset"
                    title="Double click to reset."
                    isStatic
                    confirmationMessage="Are you sure you wanna reset the game?"
                    onClick={e => state.Reset()} />

                <CustomButton text="Home"
                    title="Double click to go home."
                    confirmationMessage="Are you sure you wanna leave the game?"
                    href="/" />
            </section>
        </footer>
    );
}