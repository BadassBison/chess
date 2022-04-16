import { Point } from 'pixi.js';
import { GameShape } from './board/shapes';
import { Square } from './board/Square';
import { Piece } from './pieces';
export declare type Player = 'white' | 'black';
export declare type PieceColor = 'white' | 'black';
export declare type GameShapeName = 'newGame' | 'ruyLopez' | 'italianGame' | 'sicilianDefense' | 'frenchDefense';
export declare type BoardShape = Map<string, Square>;
export interface MoveTracker {
    pieceName: string;
    oldPosition: string;
    newPosition: string;
    attackedPiece?: string;
}
export interface HistoryTrackerOptions {
    move?: MoveTracker;
    boardShape?: BoardShape;
}
export declare type HistoryTracker = (values: HistoryTrackerOptions) => void;
export declare type AttackingTracker = (attackedPiece: Piece) => Piece;
export declare type BoardUpdater = (gameShape: GameShape) => void;
export declare type CastleCB = (rook: Piece) => void;
export interface HistoryData {
    gameShape: GameShape[];
    moves: MoveTracker[];
}
export interface SquareData {
    gameOptions: IGameOptions;
    row: number;
    column: number;
    startingPoint: Point;
    squareDimensions: number;
    squareClickCB: (square: Square) => void;
    historyTracker: HistoryTracker;
    attackingTracker: AttackingTracker;
}
export interface IGameOptions {
    player?: Player;
    startingShape?: GameShapeName;
    selectedEmptySquareColor?: number;
    moveableSpaceColor?: number;
    lightSquareColor?: number;
    darkSquareColor?: number;
    selectedPieceColor?: number;
    attackerPieceColor?: number;
}
