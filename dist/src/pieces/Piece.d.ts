import { Container, Sprite } from 'pixi.js';
import { ChessPosition } from '../board/ChessPosition';
import { Square } from '../board/Square';
import { BoardShape, IBoardOptions, Player } from '../models';
export declare abstract class Piece extends Container {
    color: Player;
    selectedHighlight: number;
    attackerHighlight: number;
    square: Square;
    hasMoved: boolean;
    availableMoves: Square[];
    attackingMoves: Square[];
    sprite: Sprite;
    constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IBoardOptions);
    abstract setAvailableMoves(boardState: BoardShape): void;
    abstract checkAvailableMove(square: Square, open: boolean): boolean;
    move(square: Square): Piece;
    setNewSquare(square: Square, initial?: boolean): Piece;
    getPosition(fullChessPosition?: boolean): ChessPosition | string;
    updateSquareAttackingPieces(squares: Square[]): void;
    getImgPath(): string;
    buildSprite(dimensions: number): void;
    addSelectedHighlight(): void;
    addAttackerHighlight(): void;
    showAvailableMovesHighlights(): void;
    removeAvailableMovesHighlights(): void;
    removeHighlight(): void;
}
