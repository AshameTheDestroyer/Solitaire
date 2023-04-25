type KeyEventSelector = {
    id: string;
    requireControl?: boolean;
};

var keyMap: Map<string, KeyEventSelector> = new Map([
    ["z", { id: "#undo-button", requireControl: true }],
    ["y", { id: "#redo-button", requireControl: true }],
    ["d", { id: "#deck-container>:first-child>:last-child" }],
    ["r", { id: "#reset-button" }],
    ["h", { id: "#home-button" }],
]);

export default function SetKeydownEvents(): void {
    document.body.addEventListener("keydown", e => {
        if (document.querySelector("#gameboard") == null) { return; }

        let selector: KeyEventSelector | null = keyMap.get(e.key.toLowerCase());

        if (selector == null) { return; }
        if (selector.requireControl && !e.ctrlKey) { return; }

        (document.querySelector(selector.id) as HTMLElement)?.click();
    });
}