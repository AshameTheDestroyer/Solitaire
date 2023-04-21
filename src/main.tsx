import { CSSProperties, createContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Page from "./Page/Page";
import Gameboard from "./Gameboard/Gameboard";
import DeckDisplayer from "./DeckDisplayer/DeckDisplayer";

import "./index.scss";

type MainStateProps = {
    isDarkThemed: boolean;
    ToggleDarkTheme: () => void;
};

// @ts-ignore
export const MainContext = createContext<MainStateProps>();

const darkThemeStyle: React.CSSProperties = {
    "--main-colour": "#00D647",
    "--background-colour": "#222",
    "--background-darker-colour": "#111",
    "--fore-colour": "#FFF",
    "--fore-darker-colour": "#999",
    "--main-colour-filter": "invert(40%) sepia(40%) saturate(3678%) hue-rotate(98deg) brightness(99%) contrast(105%)",
} as React.CSSProperties;

const lightThemeStyle: React.CSSProperties = {
    "--main-colour": "#F00",
    "--background-colour": "#FFF",
    "--background-darker-colour": "#999",
    "--fore-colour": "#222",
    "--fore-darker-colour": "#111",
    "--main-colour-filter": "sepia() saturate(1000%) hue-rotate(100deg) invert(1) brightness(200%)",
} as React.CSSProperties;

const ROOT: HTMLElement = document.querySelector(":root");

ReactDOM.createRoot(document.getElementById("root")
    ?? document.body).render(<Index />);

function Index() {
    const [state, setState] = useState<MainStateProps>({
        isDarkThemed: true,
        ToggleDarkTheme,
    });

    useEffect(() => {
        document.body.classList.toggle("dark-themed");
    }, []);


    function ToggleDarkTheme(): void {
        state.isDarkThemed = !state.isDarkThemed;
        setState({
            ...state,
        });

        document.body.classList.toggle("light-themed");
        document.body.classList.toggle("dark-themed");

        let style: CSSProperties = state.isDarkThemed ? darkThemeStyle : lightThemeStyle;
        for (const [key, value] of Object.entries(style)) {
            ROOT.style.setProperty(key, value);
        }
    }

    return (
        <BrowserRouter basename={window.location.pathname || ""}>
            <MainContext.Provider value={state}>
                <Routes>
                    <Route path="/" element={<Page />} />
                    <Route path="/DeckDisplayer" element={<DeckDisplayer />} />
                    <Route path="/Gameboard" element={<Gameboard />} />
                </Routes>
            </MainContext.Provider>
        </BrowserRouter>
    );
}