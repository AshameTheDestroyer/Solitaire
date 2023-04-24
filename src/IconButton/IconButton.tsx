import React from "react";

import "./IconButton.scss";

type IconButtonProps = {
    id?: string;
    className?: string;
    children?: React.ReactElement;

    title?: string;
    isClickable?: boolean;

    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function IconButton({
    id,
    children,
    className,

    title,
    isClickable = true,

    onClick,
}: IconButtonProps) {
    return (
        <button
            id={id}
            className={`icon-button ${className}`}
            title={title}
            disabled={!isClickable}
            onClick={onClick}>
            {children}
        </button>
    );
}