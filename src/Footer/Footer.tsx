import { useState, useEffect, useContext } from "react";

import IconButton from "../IconButton/IconButton";
import FormatNumber from "../Classes/NumberFormatter";
import CustomButton from "../CustomButton/CustomButton";
import { GameboardContext } from "../Gameboard/Gameboard";

import "./Footer.scss";

const TIME_STRING_LENGTH = 8,
    MOVEMENT_STRING_LENGTH = 3;

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
    }, []);

    return (
        <footer id="gameboard-footer">
            <section>
                <IconButton
                    id="undo-button"
                    className="command-button"
                    title="Undoes the latest movement."
                    isClickable={state.commandManager.canUndo}
                    onClick={e => state.Undo()}>
                    <div> {
                        FormatNumber(state.commandManager.undoableMovementCount,
                            MOVEMENT_STRING_LENGTH)
                    } </div>
                </IconButton>

                <div id="timer"> {
                    timer.toTimeString().substring(0, TIME_STRING_LENGTH)
                } </div>

                <IconButton
                    id="redo-button"
                    className="command-button"
                    title="Redoes the latest undone movement."
                    isClickable={state.commandManager.canRedo}
                    onClick={e => state.Redo()}>
                    <div> {
                        FormatNumber(state.commandManager.redoableMovementCount,
                            MOVEMENT_STRING_LENGTH)
                    } </div>
                </IconButton>
            </section>


            <section>
                <CustomButton
                    isStatic
                    text="Reset"
                    confirmationMessage="Are you sure you wanna reset the game?"
                    onClick={e => (state.Reset(), setTimer(new Date("0")))} />

                <CustomButton
                    href="/"
                    text="Home"
                    confirmationMessage="Are you sure you wanna leave the game?" />
            </section>
        </footer>
    );
}