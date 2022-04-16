import { outOfBounds } from '../utils/outOfBounds';

export class ChessPosition {
  static columnRef = 'abcdefgh';

  static getNotation(x: number, y: number): string {
    if (outOfBounds(x, y)) return;

    return `${ChessPosition.columnRef[x - 1]}-${y}`;
  }

  notation: string;
  column: number;
  x: number;
  row: number;
  y: number;

  constructor(x: number, y: number) {
    // Passed as index values starting at 0. Add 1 to normalize;
    this.update(x + 1, y + 1);
  }

  update(x: number, y: number) {
    this.x = x;
    this.column = x;

    this.y = y;
    this.row = y;

    this.notation = ChessPosition.getNotation(this.x, this.y);
  }

  set(position: ChessPosition) {
    this.update(position.x, position.y);
  }
}