import { Point } from 'pixi.js';
import { GameShape } from './board/shapes';
import { Square } from './board/Square';
import { Piece } from './pieces';

export type Player = 'white' | 'black';
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

export interface HistoryData {
  store: GameShape[];
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