import React, { useState, useEffect } from "react";

import LinkButton from "../LinkButton/LinkButton";

import "./Footer.scss";

export default function Footer() {
    return (
        <footer id="gameboard-footer">
            <div id="timer">00:00:00</div>
            <LinkButton text="Home" href="/" />
        </footer>
    );
}