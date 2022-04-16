import { Container, InteractionEvent, Point, Sprite, Texture } from 'pixi.js';
import { Board } from './board/Board';
import { GameShape, shapeFactory } from './board/shapes';
import { colors } from './constants/colors';
import { GameHistory } from './history/GameHistory';
import { GameShapeName, HistoryTrackerOptions, IGameOptions, Player } from './models';
import { onKeyPress } from './utils/onKeyPress';

export class Game extends Container {
  history: GameHistory;
  player: Player;
  boards: Board[];
  startingGameShapeName: GameShapeName;
  options: IGameOptions;

  constructor(options: IGameOptions) {
    super();

    this.history = new GameHistory((gameShape: GameShape) => { this.boardUpdater(gameShape) });
    this.options = options;
  }

  init() {
    const gameShape: GameShape = shapeFactory[this.options.startingShape]();
    this.boards = [Board.build(gameShape, this.options, ({ move, boardShape }: HistoryTrackerOptions) => this.trackHistory({ move, boardShape }))];

    this.history.initialState(gameShape);
    this.addChild(this.boards[0], this.history);
    this.addMoveBoardHandling();
    this.addButtonToCreateNewBoards(gameShape);
    this.addButtonToFlipBoard(gameShape);
  }

  addBoard(gameShape: GameShape) {
    const newBoard = Board.build(this.history.getHistory().gameShape[this.history.getHistory().gameShape.length - 1], this.options, ({ move, boardShape }: HistoryTrackerOptions) => this.trackHistory({ move, boardShape }));
    const lastBoard = this.boards[this.boards.length - 1];
    const newX = lastBoard.x + lastBoard.width + 100;
    newBoard.position.set(newX, lastBoard.y);
    this.addChild(newBoard);
    this.boards.push(newBoard);
  }

  addButtonToCreateNewBoards(gameShape: GameShape) {
    const button = new Sprite(Texture.WHITE);
    button.tint = colors.lightBlue;
    button.interactive = true;
    button.on('pointerdown', () => {
      console.log('testing');
      this.addBoard(gameShape);
    });
    button.width = 50;
    button.height = 50;
    this.addChild(button);
  }

  addButtonToFlipBoard(gameShape: GameShape) {
    const button = new Sprite(Texture.WHITE);
    button.tint = colors.magenta;
    button.interactive = true;
    button.on('pointerdown', () => {
      console.log('testing');
      this.boards[0].flipBoard(this.history);
    });
    button.width = 50;
    button.height = 50;
    button.position.set(innerWidth - 50, 0)
    this.addChild(button);
  }

  addMoveBoardHandling() {
    const canvas = new Sprite(Texture.EMPTY);
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    this.addChild(canvas);

    this.setChildIndex(this.boards[0], this.children.length - 1);
    this.setChildIndex(this.history, this.children.length - 1);
    canvas.interactive = true;

    let isDragging = false;
    const lastPosition = new Point();
    const newPosition = new Point();

    canvas.on('pointerdown', (e: InteractionEvent) => {
      isDragging = true;

      lastPosition.copyFrom(e.data.global);
    });

    canvas.on('pointerup', (e: InteractionEvent) => {
      isDragging = false;
    });

    canvas.on('pointermove', (e: InteractionEvent) => {
      if (isDragging) {

        newPosition.copyFrom(e.data.global);
        for (const board of this.boards) {
          board.x += newPosition.x - lastPosition.x;
          board.y += newPosition.y - lastPosition.y;
        }
        lastPosition.copyFrom(e.data.global);
      }
    });

  }

  trackHistory({ move, boardShape }: HistoryTrackerOptions): void {
    this.history.trackHistory({ move, boardShape });
    // this.history.updateDisplay();

    // console.log(this.history.getHistory());
  }

  boardUpdater(shape: GameShape) {
    this.boards[0].clear();
    this.boards[0].placePieces(shape);
  }
}