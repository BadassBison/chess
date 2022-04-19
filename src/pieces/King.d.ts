import { Square } from '../board/Square';
import { Piece } from './Piece';
import { BoardShape, CastleCB, IBoardOptions, PieceColor } from '../models';
export declare class King extends Piece {
    castleMoves: Map<Square, Piece>;
    castleCB: (rook: Piece) => void;
    constructor(pieceName: string, color: PieceColor, square: Square, options: IBoardOptions, castleCB: CastleCB);
    move(square: Square): Piece;
    setAvailableMoves(boardState: BoardShape): void;
    checkAvailableMove(square: Square): boolean;
    checkAvailableCastleRight(boardState: BoardShape, x: number, y: number): boolean;
    checkAvailableCastleLeft(boardState: BoardShape, x: number, y: number): boolean;
    getCastleMoves(boardState: BoardShape): void;
    triggerCastle(square: Square): void;
}
