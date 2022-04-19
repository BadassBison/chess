import { Square } from '../board/Square';
import { Piece } from './Piece';
import { BoardShape, IBoardOptions } from '../models';
export declare class Pawn extends Piece {
    promotionCB: (pawn: Piece) => void;
    constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IBoardOptions, promotionCB?: (pawn: Piece) => void);
    move(square: Square): Piece;
    setAvailableMoves(boardState: BoardShape): void;
    checkAvailableMove(square: Square): boolean;
}
