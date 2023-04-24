export default function FormatNumber(number: number, digitCount: number): string {
    const MAXIMUM: number = Math.pow(10, digitCount) - 1;
    return `${number >= MAXIMUM ? "+" : ""}${Math.min(number, MAXIMUM)}`;
}