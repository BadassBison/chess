export class Position {
  column: string;
  x: string;
  row: number;
  y: number;

  constructor(x: string, y: number) {
    this.update(x, y);
  }

  update(x: string, y: number) {
    this.x = x;
    this.column = x;

    this.y = y;
    this.row = y;
  }

  set(position: Position) {
    this.update(position.x, position.y);
  }
}