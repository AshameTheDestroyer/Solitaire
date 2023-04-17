import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./LinkButton.scss";

type LinkButtonProps = {
    children?: Array<React.ReactElement>,
    id?: string,
    className?: string,
    href?: string,
    text?: string,
    external?: boolean,
    target?: "_blank" | "_parent" | "_self" | "_top",
}

export default function LinkButton({
    children,
    id = "",
    className = "",
    href,
    text,
    external = false,
    target = "_self",
}: LinkButtonProps) {
    return (
        <button id={id} className={`link-button ${className}`}
            onClick={e => e.currentTarget.querySelector("a")?.click()}
            style={{
                "--character-count": text?.length ?? 0,
            } as React.CSSProperties}>
            {
                external && href ?
                    <a href={href} target={target} tabIndex={-1}>{text}</a> :
                    href ?
                        <Link to={href} tabIndex={-1}>{text}</Link> :
                        <Link to={"/NotFound"} tabIndex={-1}>{text}</Link>
            }
            {children}
        </button>
    );
}