import { Container } from 'pixi.js';
import { Board } from './board/Board';
import { GameShape, shapeFactory } from './board/shapes';
import { GameHistory } from './history/GameHistory';
import { GameShapeName, HistoryTrackerOptions, IGameOptions, Player } from './models';

export class Game extends Container {
  history: GameHistory;
  player: Player;
  board: Board;
  startingGameShapeName: GameShapeName;
  options: IGameOptions;

  constructor(options: IGameOptions) {
    super();

    this.history = new GameHistory((gameShape: GameShape) => { this.boardUpdater(gameShape) });
    this.options = options;
  }

  init() {
    const gameShape: GameShape = shapeFactory[this.options.startingShape]();
    this.board = Board.build(gameShape, this.options, ({ move, boardShape }: HistoryTrackerOptions) => this.trackHistory({ move, boardShape }));

    this.history.initialState(gameShape);
    this.addChild(this.board, this.history);
  }

  trackHistory({ move, boardShape }: HistoryTrackerOptions): void {
    this.history.trackHistory({ move, boardShape });
    this.history.updateDisplay();
  }

  boardUpdater(shape: GameShape) {
    this.board.clear();
    this.board.placePieces(shape);
  }
}