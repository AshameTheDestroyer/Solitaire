import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CSSProperties, createContext, useEffect, useState } from "react";

import Page from "./Page/Page";
import Gameboard from "./Gameboard/Gameboard";
import DeckDisplayer from "./DeckDisplayer/DeckDisplayer";

import "./index.scss";

type MainStateProps = {
    isDarkThemed: boolean;

    ToggleDarkTheme: () => void;
};

export const MainContext = createContext<MainStateProps>(null);

const darkThemeStyle: React.CSSProperties = {
    "--fore-colour": "#FFFFFF",
    "--background-colour": "#222222",
    "--fore-darker-colour": "#999999",
    "--background-darker-colour": "#111111",
} as React.CSSProperties;

const lightThemeStyle: React.CSSProperties = {
    "--fore-colour": "#222222",
    "--background-colour": "#FFFFFF",
    "--fore-darker-colour": "#111111",
    "--background-darker-colour": "#999999",
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