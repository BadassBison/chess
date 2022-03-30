import { Container } from '@pixi/display';
import { Piece } from '../pieces/Piece';
import { Point, Sprite, Texture } from 'pixi.js';
import { ChessPosition } from '../utils/ChessPosition';
import { GlowFilter } from '@pixi/filter-glow';

export class Square extends Container {
  static light = 0xEDC40E;
  static dark = 0x8F7609;

  chessPosition: ChessPosition;
  state: Piece | null;
  hitbox: Sprite;

  constructor(row: number, column: number, startingPoint: Point, squareDimensions: number) {
    super();

    this.chessPosition = new ChessPosition(column, 8 - row);

    this.name = `square-${this.chessPosition.notation}`;
    this.state = null;

    const isLight = (row + column) % 2 != 0;

    const x = column * squareDimensions + startingPoint.x;
    const y = row * squareDimensions + startingPoint.y;

    const squareUI = new Sprite(Texture.WHITE);
    this.position.set(x, y);
    squareUI.width = squareDimensions;
    squareUI.height = squareDimensions;
    squareUI.tint = isLight ? Square.light : Square.dark;

    this.addChild(squareUI);

    this.interactive = true;
  }

  setPiece(piece: Piece) {
    if (this.state) {
      this.parent.removeChild(this.state);
    }

    this.state = piece;
  }

  setSquareCallBack(piece: Piece): void {
    piece.move(this);
    piece.removeHighlight();
    piece.removeAvailableMoveHighlights();
  }

  addHighlight(piece: Piece): void {
    // Move the square to the top
    this.parent.setChildIndex(this, this.parent.children.length - 1);

    // if the square has a piece, move the piece to the top
    if (this.state) {
      this.parent.setChildIndex(this.state, this.parent.children.length - 1);
      this.hitbox = new Sprite(Texture.WHITE);
      this.hitbox.tint = 0xffffff;
      this.hitbox.alpha = 0.5;
      this.hitbox.width = this.width;
      this.hitbox.height = this.height;
      this.hitbox.position.set(this.x, this.y);
      this.parent.addChild(this.hitbox);

      this.hitbox.interactive = true;
      this.hitbox.on('click', () => { this.setSquareCallBack(piece) })
    }


    this.filters = [
      new GlowFilter({
        outerStrength: 2.6,
        distance: 12,
        color: 0xcc0000,
      }),
    ];
  }

  removeHighlight(): void {
    this.filters = null;
    if (this.hitbox) {
      this.parent.removeChild(this.hitbox);
    }
  }
}