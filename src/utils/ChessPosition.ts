export class ChessPosition {
  static columnRef = 'abcdefgh';

  static getNotation(x: number, y: number): string {
    return `${ChessPosition.columnRef[x - 1]}-${y}`;
  }

  notation: string;
  column: number;
  x: number;
  row: number;
  y: number;


  constructor(x: number, y: number) {
    this.update(x, y);
  }

  update(x: number, y: number) {
    this.x = x + 1;
    this.column = x + 1;

    this.y = y;
    this.row = y;

    this.notation = ChessPosition.getNotation(this.x, this.y);
  }

  set(position: ChessPosition) {
    this.update(position.x, position.y);
  }
}