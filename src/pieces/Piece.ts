import { GlowFilter } from '@pixi/filter-glow';
import { Container } from 'pixi.js';
import { Square } from '../board/Square';
import { makeDraggable } from '../utils/makeDraggable';

export abstract class Piece extends Container {
  color: 'white' | 'black';
  square: Square;

  constructor(square: Square, cb: Function) {
    super();
    this.setNewSquare(square);
    makeDraggable(this);

    this.interactive = true;
    this.on('mousedown', () => {

      this.filters = [
        new GlowFilter({
          outerStrength: 2.6,
          distance: 12,
          color: 0x00ffff,
        }),
      ];

      cb(this, 'mousedown');
    });

  }

  setNewSquare(square: Square): void {
    this.square = square;
    square.state = this;
    square.addChild(this);
    this.position.set(0, 0);
  };

  move(square: Square): void {
    // TODO: Animation to move pieces
    const oldSquare = this.square;
    oldSquare.state = null;
    oldSquare.removeChild(this);

    this.setNewSquare(square);
  };
}