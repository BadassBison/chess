import { Container, Sprite, Texture, Text } from 'pixi.js';
import { Board } from './board/Board';
import { GameShape, shapeFactory } from './board/shapes';
import { colors } from './constants/colors';
import { GameShapeName, Player } from './models';
import { DefaultBoardOptions } from './constants/DefaultBoardOptions';
export class Game extends Container {
  // history: GameHistory;
  player: Player;
  boards: Board[];
  shownBoardIdx: number;
  startingGameShapeName: GameShapeName;

  constructor() {
    super();

    this.shownBoardIdx = 0;
  }


  init() {
    const gameShape: GameShape = shapeFactory[DefaultBoardOptions.startingShape]();
    this.boards = [new Board(gameShape, DefaultBoardOptions, 1)];

    this.addChild(this.boards[0]);
    this.addButtonToFlipBoard();
    this.addButtonToMoveToNextBoardOrCreateNewBoard();
    this.addButtonToMoveBackABoard();
  }

  /**
   * Duplicates the last board
   */
  addBoard() {
    const lastBoard = this.boards[this.boards.length - 1];

    const newBoard = new Board(lastBoard.getGameShape(), lastBoard.boardOptions, this.boards.length + 1, lastBoard.history.getHistory());
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
      this.shownBoardIdx++;
      if (this.shownBoardIdx === this.boards.length) {
        this.addBoard();
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

  addButtonToFlipBoard() {
    const button = new Sprite(Texture.WHITE);
    button.tint = colors.magenta;
    button.interactive = true;
    button.width = innerWidth / 2;
    button.height = 50;
    button.position.set(0, innerHeight - 100);

    const label = new Text('FLIP', { fontSize: 24 });
    label.anchor.set(0.5);
    label.position.set(button.x + button.width / 2, button.y + button.height / 2);

    this.addChild(button, label);

    button.on('pointerdown', () => {
      this.boards[this.shownBoardIdx].flipBoard();
    });
  }

  // TODO: History needs to be per board
  // trackHistory({ move, boardShape }: HistoryTrackerOptions): void {
  //   this.history.trackHistory({ move, boardShape });
  // this.history.updateDisplay();

  // console.log(this.history.getHistory());
  // }
}