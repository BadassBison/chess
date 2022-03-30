import { Container } from '@pixi/display';
import { Piece } from '../pieces/Piece';
import { Point, Sprite, Texture } from 'pixi.js';

export class Square extends Container {
  static columnRef = 'abcdefgh';
  static light = 0xEDC40E;
  static dark = 0x8F7609;

  chessPosition: string;
  state: Piece | null;

  constructor(row: number, column: number, startingPoint: Point, squareDimensions: number, cb: Function) {
    super();
    const chessPosRow = 8 - row;
    const chessPosColumn = Square.columnRef[column];

    this.name = `square-${chessPosColumn}-${chessPosRow}`;
    this.state = null;

    const isLight = (row + column) % 2 != 0;

    const x = column * squareDimensions + startingPoint.x;
    const y = row * squareDimensions + startingPoint.y;

    const squareUI = new Sprite(Texture.WHITE);
    this.position.set(x, y);
    squareUI.width = squareDimensions;
    squareUI.height = squareDimensions;
    squareUI.tint = isLight ? Square.light : Square.dark;

    this.chessPosition = `${chessPosColumn}-${chessPosRow}`;
    this.addChild(squareUI);

    this.interactive = true;
    this.on('mouseup', () => {
      console.log(this.chessPosition);
      cb(this);
    });

  }
}