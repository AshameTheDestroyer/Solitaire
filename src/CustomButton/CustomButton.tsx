import React from "react";
import { Link } from "react-router-dom";

import "./CustomButton.scss";

type CustomButtonProps = {
    children?: Array<React.ReactElement>;
    id?: string;
    className?: string;
    title?: string;
    href?: string;
    text?: string;
    confirmationMessage?: string;
    external?: boolean;
    target?: "_blank" | "_parent" | "_self" | "_top";
    isStatic?: boolean;
    requireDoubleClicking?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function CustomButton({
    children,
    id,
    className,
    title,
    href,
    text,
    confirmationMessage,
    external = false,
    target = "_self",
    isStatic = false,
    requireDoubleClicking = false,
    onClick,
}: CustomButtonProps) {
    function CreateClickEvent(eventType: "click" | "doubleClick"):
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
        return function (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
            const ANCHOR: HTMLAnchorElement = e.currentTarget.querySelector("a");

            if (e.target == ANCHOR) { return; }
            if (eventType == "click" && requireDoubleClicking) { return; }
            if (eventType == "doubleClick" && !requireDoubleClicking) { return; }
            if (confirmationMessage && !confirm(confirmationMessage)) { return; }

            onClick?.(e);

            if (isStatic) { return; }
            ANCHOR.click();
        }
    }

    return (
        <button id={id}
            className={`custom-button ${className}`}
            title={title}
            onClick={CreateClickEvent("click")}
            onDoubleClick={CreateClickEvent("doubleClick")}
            style={{
                "--character-count": text?.length ?? 0,
            } as React.CSSProperties}> {
                external && href ?
                    <a href={href} target={target} tabIndex={-1}>{text}</a> :
                    href ?
                        <Link to={href} tabIndex={-1}>{text}</Link> :
                        <Link to={"/NotFound"} tabIndex={-1}>{text}</Link>
            } {children} </button>
    );
}