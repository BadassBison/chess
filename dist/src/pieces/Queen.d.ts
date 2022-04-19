import { Square } from '../board/Square';
import { Piece } from './Piece';
import { BoardShape, IBoardOptions } from '../models';
export declare class Queen extends Piece {
    constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IBoardOptions);
    setAvailableMoves(boardState: BoardShape): void;
    checkAvailableMove(square: Square): boolean;
}
