import { Container, InteractionEvent, Point, Sprite, Texture, Text } from 'pixi.js';
import { Board } from './board/Board';
import { GameShape, shapeFactory } from './board/shapes';
import { colors } from './constants/colors';
import { GameHistory } from './history/GameHistory';
import { GameShapeName, HistoryTrackerOptions, IGameOptions, Player } from './models';
export class Game extends Container {
  history: GameHistory;
  player: Player;
  boards: Board[];
  shownBoardIdx: number;
  startingGameShapeName: GameShapeName;

  options: IGameOptions;

  constructor(options: IGameOptions) {
    super();

    this.shownBoardIdx = 0;
    this.history = new GameHistory((gameShape: GameShape) => { this.boardUpdater(gameShape) });
    this.options = options;
  }

  init() {
    const gameShape: GameShape = shapeFactory[this.options.startingShape]();
    this.boards = [Board.build(gameShape, this.options, ({ move, boardShape }: HistoryTrackerOptions) => this.trackHistory({ move, boardShape }), 1)];

    this.history.initialState(gameShape);
    this.addChild(this.boards[0], this.history);
    // this.addMoveBoardHandling();
    // this.addButtonToCreateNewBoards(gameShape);
    this.addButtonToFlipBoard();
    this.addButtonToMoveToNextBoardOrCreateNewBoard();
    this.addButtonToMoveBackABoard();
  }

  addBoard() {
    const newBoard = Board.build(this.history.getHistory().gameShape[this.history.getHistory().gameShape.length - 1], this.options, ({ move, boardShape }: HistoryTrackerOptions) => this.trackHistory({ move, boardShape }), this.boards.length + 1);
    newBoard.position.set(0, 0);
    this.boards.push(newBoard);
  }


  addButtonToMoveToNextBoardOrCreateNewBoard() {
    const button = new Sprite(Texture.WHITE);
    button.tint = colors.lightBlue;
    button.width = innerWidth / 2;
    button.height = 50;
    button.position.set(button.width, innerHeight - button.height);

    const label = new Text('>', { fontSize: 32 });
    label.anchor.set(0.5);
    label.position.set(button.x + button.width / 2, button.y + button.height / 2);

    this.addChild(button, label);

    button.interactive = true;
    button.on('pointerdown', () => {
      console.log({ idx: this.shownBoardIdx });
      this.shownBoardIdx++;
      console.log({ idx: this.shownBoardIdx });
      if (this.shownBoardIdx === this.boards.length) {
        this.addBoard();
        console.log({ boards: this.boards });
      }
      this.removeChild(this.boards[this.shownBoardIdx - 1]);
      this.addChild(this.boards[this.shownBoardIdx]);
    });
  }

  addButtonToMoveBackABoard() {
    const button = new Sprite(Texture.WHITE);
    button.tint = colors.cyan;
    button.interactive = true;
    button.width = innerWidth / 2;
    button.height = 50;
    button.position.set(0, innerHeight - button.height);

    const label = new Text('<', { fontSize: 32 });
    label.anchor.set(0.5);
    label.position.set(button.x + button.width / 2, button.y + button.height / 2);

    this.addChild(button, label);

    button.on('pointerdown', () => {
      if (this.shownBoardIdx > 0) {
        this.removeChild(this.boards[this.shownBoardIdx]);
        this.shownBoardIdx--;
        this.addChild(this.boards[this.shownBoardIdx]);
      }
    });
  }

  addButtonToCreateNewBoards() {
    const button = new Sprite(Texture.WHITE);
    button.tint = colors.lightBlue;
    button.interactive = true;
    button.on('pointerdown', () => {
      this.addBoard();
    });
    button.width = 50;
    button.height = 50;
    button.position.set(0, innerHeight / 2)
    this.addChild(button);
  }

  addButtonToFlipBoard() {
    const button = new Sprite(Texture.WHITE);
    button.tint = colors.magenta;
    button.interactive = true;
    button.width = innerWidth / 2;
    button.height = 50;
    button.position.set(innerWidth / 2, innerHeight / 2);

    const label = new Text('FLIP', { fontSize: 24 });
    label.anchor.set(0.5);
    label.position.set(button.x + button.width / 2, button.y + button.height / 2);

    this.addChild(button, label);

    button.on('pointerdown', () => {
      this.boards[this.shownBoardIdx].flipBoard(this.history);
    });
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