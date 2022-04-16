import { Container } from '@pixi/display';
import { Piece } from '../pieces/Piece';
import { Sprite } from 'pixi.js';
import { ChessPosition } from './ChessPosition';
import { AttackingTracker, HistoryTracker, SquareData } from '../models';
export declare class Square extends Container {
    chessPosition: ChessPosition;
    piece: Piece | null;
    sprite: Sprite;
    hitbox: Sprite;
    attackingPieces: Piece[];
    baseColor: number;
    selectedEmptySquareHighlight: number;
    moveableSpaceHighlight: number;
    historyTracker: HistoryTracker;
    attackingTracker: AttackingTracker;
    constructor(squareData: SquareData);
    setPiece(piece: Piece, initial: boolean): Piece;
    setupHitbox(squareClickCB: (square: Square) => void): void;
    orderDisplay(): void;
    AddAllHighlights(): void;
    addSelectedBorderHighlight(): void;
    addSelectedEmptyHighlight(): void;
    addMoveableSpaceHighlight(): void;
    showAttackingPiecesHighlight(): void;
    removeAttackingPiecesHighlight(): void;
    removeHighlight(): void;
    removeAllHighlights(): void;
}
