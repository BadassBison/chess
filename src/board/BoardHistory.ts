import { Container, Text, Graphics, Sprite, Texture } from 'pixi.js';
import { GameShape } from './shapes';
import { BoardUpdater, HistoryData, HistoryTrackerOptions, MoveTracker } from '../models';
import { buildGameShape } from '../utils/buildGameShape';
import { Scrollbox } from 'pixi-scrollbox'

export class BoardHistory extends Container {

  static nullMove: MoveTracker = {
    pieceName: '',
    oldPosition: '',
    newPosition: ''
  }

  gameShape: GameShape[];
  moves: MoveTracker[];
  scrollbox: Scrollbox;
  fontSize: number;
  boardUpdater: BoardUpdater

  constructor(parent: Container, gameShape: GameShape, boardUpdater: BoardUpdater, previousHistory?: HistoryData) {
    super();
    this.parent = parent;
    this.gameShape = previousHistory ? [...previousHistory.gameShape] : [];
    this.moves = previousHistory ? [...previousHistory.moves] : [];
    this.fontSize = 16;

    this.boardUpdater = boardUpdater;
    if (!previousHistory) { this.initialState(gameShape); }

    this.parent.addChild(this);
    this.initScrollbox();
  }

  initialState(gameShape: GameShape): void {
    this.gameShape.push(gameShape);
    this.moves.push(BoardHistory.nullMove);
  }

  initScrollbox(): void {
    this.scrollbox = new Scrollbox({
      boxWidth: 230,
      boxHeight: 260,
      clampWheel: false,
      scrollbarSize: 26
    });

    this.addChild(this.scrollbox);
    this.scrollbox.position.set(innerWidth / 2 + 20, this.parent.height - 30);
    for (let i = 1; i < this.moves.length; i++) {
      const move = this.moves[i];
      const content = `${i}: ${move.pieceName} => ${move.newPosition}`;
      this.scrollbox.content.addChild(this.createRow(content, i));
    }
    this.scrollbox.update();
  }

  trackHistory({ move, boardShape }: HistoryTrackerOptions): void {
    this.moves.push(move);
    this.gameShape.push(buildGameShape(boardShape));
    this.updateScrollbox();
  }

  getHistory(): HistoryData {
    return { gameShape: this.gameShape, moves: this.moves };
  }

  updateScrollbox(): void {
    const rowIdx = this.moves.length - 1;
    const move = this.moves[rowIdx];
    const content = `${rowIdx}: ${move.pieceName} => ${move.newPosition}`;
    this.scrollbox.content.addChild(this.createRow(content, rowIdx));
    this.scrollbox.update();
  }

  createRow(rowContent: string, rowIdx: number): Text {
    const rowPadding = 25;

    const row = new Text(rowContent, { fontSize: this.fontSize });
    row.position.set(0, (rowIdx - 1) * rowPadding);
    row.name = `History row ${rowIdx}`;

    row.interactive = true;
    row.buttonMode = true;
    row.on('pointerdown', () => {
      this.boardUpdater(this.gameShape[rowIdx]);
    });

    return row;
  }
}