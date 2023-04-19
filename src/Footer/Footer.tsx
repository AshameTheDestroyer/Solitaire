import React, { useState, useEffect } from "react";

import LinkButton from "../LinkButton/LinkButton";

import "./Footer.scss";

export default function Footer() {
    const [timer, setTimer] = useState(new Date("0"));

    const TIME_STRING_LENGTH = 8;

    useEffect(() => {
        const FULL_SECOND = 1000;

        setInterval(() => {
            setTimer(previousValue => {
                let value = new Date(previousValue);
                value.setSeconds(value.getSeconds() + 1);

                return value;
            });
        }, FULL_SECOND);
    }, []);

    return (
        <footer id="gameboard-footer">
            <div id="timer"> {
                timer.toTimeString().substring(0, TIME_STRING_LENGTH)
            } </div>

            <LinkButton text="Home" href="/" />
        </footer>
    );
}