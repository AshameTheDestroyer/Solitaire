import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Page from "./Page/Page";
import DeckDisplayer from "./DeckDisplayer/DeckDisplayer";
import Gameboard from "./Gameboard/Gameboard";

import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") ?? document.body).render(
    <BrowserRouter basename={window.location.pathname || ""}>
        <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/DeckDisplayer" element={<DeckDisplayer />} />
            <Route path="/Gameboard" element={<Gameboard />} />
        </Routes>
    </BrowserRouter>
);