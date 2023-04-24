export type UndoableAction = {
    Action: () => void;
    ReversedAction: () => void;
};

export default class CommandManager {
    private static instance: CommandManager;

    public static get Instance(): CommandManager {
        return this.instance ??= new CommandManager();
    }

    private actions: Array<UndoableAction>;
    private undoingIndex: number;

    public get undoableMovementCount(): number {
        return this.undoingIndex;
    }

    public get redoableMovementCount(): number {
        return this.actions.length - this.undoingIndex;
    }

    public get canUndo(): boolean {
        return this.undoableMovementCount > 0;
    }

    public get canRedo(): boolean {
        return this.redoableMovementCount > 0;
    }

    private constructor() {
        this.Reset();
    }

    public Invoke(undoableAction: UndoableAction): void {
        this.actions = this.actions.slice(0, this.undoingIndex);

        this.actions.push(undoableAction);
        undoableAction.Action();

        this.undoingIndex++;
    }

    public Undo(): void {
        if (this.undoingIndex == 0) { return; }

        this.actions[--this.undoingIndex].ReversedAction();
    }

    public Redo(): void {
        if (this.undoingIndex == this.actions.length) { return; }

        this.actions[this.undoingIndex++].Action();
    }

    public Reset(): void {
        this.actions = new Array<UndoableAction>();
        this.undoingIndex = 0;
    }
}