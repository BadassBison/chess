import { Point, Text } from 'pixi.js';
import { GameShape } from './board/shapes';
import { Square } from './board/Square';
import { Piece } from './pieces';

export type Player = 'white' | 'black';
export type PieceColor = 'white' | 'black';
export type GameShapeName = 'newGame' | 'ruyLopez' | 'italianGame' | 'sicilianDefense' | 'frenchDefense';

export type BoardShape = Map<string, Square>

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

export type HistoryTracker = (values: HistoryTrackerOptions) => void;
export type AttackingTracker = (attackedPiece: Piece) => Piece;
export type BoardUpdater = (gameShape: GameShape) => void;
export type CastleCB = (rook: Piece) => void;

export interface HistoryData {
  gameShape: GameShape[];
  moves: MoveTracker[];
}

export interface SquareData {
  boardOptions: IBoardOptions;
  row: number;
  column: number;
  startingPoint: Point;
  squareDimensions: number;
  squareClickCB: (square: Square) => void;
  // historyTracker: HistoryTracker;
  attackingTracker: AttackingTracker;
}

export interface IBoardOptions {
  player?: Player;
  startingShape?: GameShapeName;
  selectedEmptySquareColor?: number;
  moveableSpaceColor?: number;
  lightSquareColor?: number;
  darkSquareColor?: number;
  selectedPieceColor?: number;
  attackerPieceColor?: number;
}

export interface GameDimensions {
  squareDimensions: number;
  startingPoint: Point;
  isHorizontalScreen: boolean;
}