export declare class ChessPosition {
    static columnRef: string;
    static getNotation(x: number, y: number): string;
    notation: string;
    column: number;
    x: number;
    row: number;
    y: number;
    constructor(x: number, y: number);
    update(x: number, y: number): void;
    set(position: ChessPosition): void;
}
