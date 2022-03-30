import { GlowFilter } from '@pixi/filter-glow';
import { Container, Point } from 'pixi.js';
import { BoardShape } from '../board/Board';
import { Square } from '../board/Square';

export abstract class Piece extends Container {
  color: 'white' | 'black';
  square: Square;
  hasMoved: boolean;
  availableMoves: Square[];

  constructor(square: Square) {
    super();
    this.setNewSquare(square);
    this.hasMoved = false;
    this.interactive = true;
  }

  setNewSquare(square: Square): void {
    this.square = square;
    square.setPiece(this);
    this.position.set(square.x, square.y);
  };

  move(square: Square): void {
    this.hasMoved = true;
    const oldSquare = this.square;
    oldSquare.state = null;

    this.setNewSquare(square);
  };

  addHighlight(): void {
    this.filters = [
      new GlowFilter({
        outerStrength: 2.6,
        distance: 12,
        color: 0x00ffff,
      }),
    ];
  }

  removeHighlight(): void {
    this.filters = null;
    this.removeAvailableMoveHighlights();
  }

  addAvailableMoveHighlights(): void {
    for (const availableMove of this.availableMoves) {
      availableMove.addHighlight(this);
    }
  }

  removeAvailableMoveHighlights(): void {
    for (const availableMove of this.availableMoves) {
      availableMove.removeHighlight();
      availableMove.removeAllListeners();
    }
  }

  abstract checkAvailableMove(square: Square, open: boolean): boolean;

  abstract getAvailableMoves(boardState: BoardShape): void;


}