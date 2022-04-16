import { Container, Sprite } from 'pixi.js';
import { ChessPosition } from '../board/ChessPosition';
import { Square } from '../board/Square';
import { BoardShape, IGameOptions, Player } from '../models';
export declare abstract class Piece extends Container {
    color: Player;
    selectedHighlight: number;
    attackerHighlight: number;
    square: Square;
    hasMoved: boolean;
    availableMoves: Square[];
    attackableSquares: Square[];
    sprite: Sprite;
    constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IGameOptions);
    setNewSquare(square: Square, initial?: boolean): Piece;
    move(square: Square): Piece;
    addSelectedHighlight(): void;
    addAttackerHighlight(): void;
    removeHighlight(): void;
    getImgPath(): string;
    buildSprite(dimensions: number): void;
    showAvailableMoves(): void;
    removeAvailableMovesHighlights(): void;
    getPosition(fullChessPosition?: boolean): ChessPosition | string;
    updateSquareAttackingPieces(squares: Square[]): void;
    abstract setAvailableMoves(boardState: BoardShape): void;
    abstract checkAvailableMove(square: Square, open: boolean): boolean;
}
