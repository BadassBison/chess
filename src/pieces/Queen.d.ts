import { Square } from '../board/Square';
import { Piece } from './Piece';
import { BoardShape, IGameOptions } from '../models';
export declare class Queen extends Piece {
    constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IGameOptions);
    setAvailableMoves(boardState: BoardShape): void;
    checkAvailableMove(square: Square): boolean;
}
