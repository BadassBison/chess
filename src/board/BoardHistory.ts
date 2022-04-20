import { Container, Text, Graphics, Sprite, Texture } from 'pixi.js';
import { GameShape } from './shapes';
import { BoardUpdater, HistoryData, HistoryTrackerOptions, MoveTracker } from '../models';
import { buildGameShape } from '../utils/buildGameShape';
import { Scrollbox } from 'pixi-scrollbox'
import { Board } from './Board';
import { pieceNameToSymbol } from '../utils/pieceNameToSymbol';
import { GlowFilter } from '@pixi/filter-glow';
import { colors } from '../constants/colors';

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
  lastCheckedRow: number;
  selectedRow: Text;
  glowFilter: GlowFilter;
  boardUpdater: BoardUpdater;

  constructor(parent: Container, gameShape: GameShape, boardUpdater: BoardUpdater, previousHistory?: HistoryData) {
    super();
    this.parent = parent;
    this.gameShape = previousHistory ? [...previousHistory.gameShape] : [];
    this.moves = previousHistory ? [...previousHistory.moves] : [];
    this.lastCheckedRow = this.moves.length;
    this.fontSize = 16;
    this.glowFilter = new GlowFilter({
      outerStrength: 2.6,
      distance: 12,
      color: colors.yellow,
    });

    this.boardUpdater = boardUpdater;
    if (!previousHistory) { this.initialState(gameShape); }

    this.parent.addChild(this);
    this.initScrollbox();
  }

  initialState(gameShape: GameShape): void {
    this.gameShape.push(gameShape);
    this.moves.push(BoardHistory.nullMove);
    this.lastCheckedRow = this.moves.length;
  }

  initScrollbox(): void {
    const parent = this.parent as Board;

    this.scrollbox = new Scrollbox({
      boxWidth: innerWidth / 2 - 20,
      boxHeight: innerHeight - this.parent.height - 30,
      clampWheel: false,
      overflowX: 'none',
      scrollbarSize: 26
    });

    this.addChild(this.scrollbox);
    this.scrollbox.position.set(innerWidth / 2 + 20, parent.height - parent.label.height);
    for (let i = 1; i < this.moves.length; i++) {
      const move = this.moves[i];
      this.scrollbox.content.addChild(this.createRow(i, move));
    }
    this.scrollbox.update();
  }

  trackHistory({ move, boardShape }: HistoryTrackerOptions): void {
    this.moves.push(move);
    this.gameShape.push(buildGameShape(boardShape));
    this.lastCheckedRow = this.moves.length;
    this.selectedRow = null;
    this.updateScrollbox();

    // console.log(this.gameShape[this.gameShape.length - 1]);
  }

  getHistory(): HistoryData {
    return { gameShape: this.gameShape, moves: this.moves };
  }

  updateScrollbox(): void {
    this.scrollbox.content.removeChildren();

    for (let i = 1; i < this.moves.length; i++) {
      this.scrollbox.content.addChild(this.createRow(i, this.moves[i]));
    }

    this.scrollbox.update();
  }

  createRow(rowIdx: number, move: MoveTracker): Text {
    const rowPadding = 25;
    const sym = pieceNameToSymbol(move.pieceName);
    const took = move.attackedPiece ? `x ${pieceNameToSymbol(move.attackedPiece)}` : '';
    const content = `${rowIdx}: ${sym} : ${move.newPosition} ${took}`;

    const row = new Text(content, { fontSize: this.fontSize });
    row.position.set(0, (rowIdx - 1) * rowPadding);
    row.name = `History row ${rowIdx}`;

    row.interactive = true;
    row.buttonMode = true;
    row.on('pointerdown', () => {
      this.lastCheckedRow = rowIdx;
      if (this.selectedRow) {
        this.selectedRow.filters = null;
      }
      this.selectedRow = row;
      row.filters = [this.glowFilter];
      this.boardUpdater(this.gameShape[rowIdx]);
    });

    return row;
  }

  clean() {
    if (this.lastCheckedRow !== this.moves.length) {
      this.moves = this.moves.slice(0, this.lastCheckedRow + 1);
      this.gameShape = this.gameShape.slice(0, this.lastCheckedRow + 1);
    }
  }
}