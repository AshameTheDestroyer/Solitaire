import React from "react";
import { Link } from "react-router-dom";

import "./CustomButton.scss";

type CustomButtonProps = {
    id?: string;
    className?: string;
    children?: Array<React.ReactElement>;

    href?: string;
    text?: string;
    title?: string;
    external?: boolean;
    isStatic?: boolean;
    confirmationMessage?: string;
    requireDoubleClicking?: boolean;
    target?: "_blank" | "_parent" | "_self" | "_top";

    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function CustomButton({
    id,
    children,
    className,

    text,
    href,
    title,
    target = "_self",
    external = false,
    isStatic = false,
    confirmationMessage,
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
        <button
            id={id} className={`custom-button ${className}`}
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