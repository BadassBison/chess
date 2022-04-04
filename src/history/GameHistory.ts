import { GameShape } from '../board/shapes';
import { BoardShape, HistoryData, HistoryTrackerOptions, MoveTracker } from '../models';
import { buildGameShape } from '../utils/buildGameShape';

export class GameHistory {

  static nullMove: MoveTracker = {
    pieceName: '',
    oldPosition: '',
    newPosition: ''
  }

  store: GameShape[];
  moves: MoveTracker[];

  constructor() {
    this.store = [];
    this.moves = [];
  }

  initialState(gameShape: GameShape): void {
    this.store.push(gameShape);
    this.moves.push(GameHistory.nullMove);
  }

  trackHistory({ move, boardShape }: HistoryTrackerOptions) {
    this.moves.push(move);
    this.store.push(buildGameShape(boardShape));
  }

  getHistory(): HistoryData {
    return { store: this.store, moves: this.moves };
  }
}