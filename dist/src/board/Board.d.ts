import { Container, Point, Text } from 'pixi.js';
import { Piece } from '../pieces';
import { GameShape } from './shapes';
import { Square } from './Square';
import { BoardShape, HistoryTracker, IGameOptions } from '../models';
import { GameHistory } from '../history/GameHistory';
export declare class Board extends Container {
    static build(gameShape: GameShape, gameOptions: IGameOptions, historyTracker: HistoryTracker): Board;
    boardShape: BoardShape;
    boardPieces: Piece[];
    currentlySelectedSquare: Square;
    squareDimensions: number;
    startingPoint: Point;
    gameOptions: IGameOptions;
    notationRow: Text[];
    notationColumn: Text[];
    historyTracker: HistoryTracker;
    constructor(gameShape: GameShape, options: IGameOptions, historyTracker: HistoryTracker);
    buildSquares(): void;
    flipBoard(history: GameHistory): void;
    buildNotations(): void;
    placePieces(shape: GameShape): void;
    promotion(pawn: Piece): void;
    castle(rook: Piece): void;
    setPiece(pieceName: string, square: Square, options: IGameOptions): Piece;
    handleSquareClick(newSelectedSquare: Square): void;
    calculateDimensions(): void;
    getSquareByPosition(position: string): Square;
    trackInitialShape(): void;
    trackAttack(attackedPiece: Piece): Piece;
    removeSquareAttackingPieces(): void;
    setAvailableMoves(): void;
    clear(): void;
}
