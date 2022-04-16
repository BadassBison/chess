import { Container, Text, Graphics } from 'pixi.js';
import { GameShape } from '../board/shapes';
import { BoardUpdater, HistoryData, HistoryTrackerOptions, MoveTracker } from '../models';
import { buildGameShape } from '../utils/buildGameShape';

export class GameHistory extends Container {

  static nullMove: MoveTracker = {
    pieceName: '',
    oldPosition: '',
    newPosition: ''
  }

  gameShape: GameShape[];
  moves: MoveTracker[];
  display: Container;
  fontSize: number;
  currentMoveRect: Graphics;
  boardUpdater: BoardUpdater

  constructor(boardUpdater: BoardUpdater) {
    super();
    this.gameShape = [];
    this.moves = [];
    this.currentMoveRect = new Graphics();
    this.fontSize = 12;
    this.updateDisplay();
    this.boardUpdater = boardUpdater;
    this.addChild(this.currentMoveRect);
  }

  initialState(gameShape: GameShape): void {
    this.gameShape.push(gameShape);
    this.moves.push(GameHistory.nullMove);
  }

  trackHistory({ move, boardShape }: HistoryTrackerOptions): void {
    this.moves.push(move);
    this.gameShape.push(buildGameShape(boardShape));
  }

  getHistory(): HistoryData {
    return { gameShape: this.gameShape, moves: this.moves };
  }

  updateDisplay(): void {
    if (this.display) {
      this.removeChild(this.display);
    }

    this.display = new Container();
    this.display.position.set(1180, 0);

    for (let i = 1; i < this.moves.length; i++) {
      const move = this.moves[i];
      const content = `${i}: ${move.pieceName} => ${move.newPosition}`;
      this.display.addChild(this.createRow(content, i));
    }

    this.updateCurrentMoveRect(1174, (this.moves.length - 1) * 20 - 4);
    this.addChild(this.display);
  }

  updateCurrentMoveRect(x: number, y: number) {
    this.currentMoveRect.clear();
    this.currentMoveRect.lineStyle(6, 0xFFBD01, 1);
    this.currentMoveRect.drawRect(x, y, 300, 22);
  }

  createRow(rowContent: string, rowIdx: number): Text {
    const rowPadding = 20;
    const x = 0;
    const y = (rowIdx * rowPadding);

    const row = new Text(rowContent, { fontSize: this.fontSize });
    row.position.set(x, y);
    row.name = `History row ${rowIdx}`;

    row.interactive = true;
    row.buttonMode = true;
    row.on('pointerdown', () => {
      this.boardUpdater(this.gameShape[rowIdx]);
      this.updateCurrentMoveRect(1174, rowIdx * 20 - 4);
    });

    return row;
  }
}