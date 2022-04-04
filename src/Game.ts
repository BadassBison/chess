import { Container } from 'pixi.js';
import { Board } from './board/Board';
import { GameShape, shapeFactory } from './board/shapes';
import { GameHistory } from './history/GameHistory';
import { GameShapeName, HistoryTrackerOptions, IGameOptions, Player } from './models';

export class Game extends Container {
  history: GameHistory;
  player: Player;
  startingGameShapeName: GameShapeName;
  options: IGameOptions;

  constructor(options: IGameOptions) {
    super();

    this.history = new GameHistory();
    this.options = options;
  }

  init() {
    const gameShape: GameShape = shapeFactory[this.options.startingShape]();
    const board = Board.build(gameShape, this.options, ({ move, boardShape }: HistoryTrackerOptions) => this.trackHistory({ move, boardShape }));
    this.addChild(board);

    this.history.initialState(gameShape);
  }

  trackHistory({ move, boardShape }: HistoryTrackerOptions): void {
    this.history.trackHistory({ move, boardShape });

    console.log(this.history.getHistory());
  }
}