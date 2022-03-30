import { Sprite } from 'pixi.js';
import { BoardShape } from '../board/Board';
import { Square } from '../board/Square';
import { ChessPosition } from '../utils/ChessPosition';
import { Piece } from './Piece';

export class King extends Piece {

  constructor(color: 'white' | 'black', square: Square) {
    super(square);
    this.name = `${color}-king`;
    this.color = color;

    const sprite = Sprite.from(`img/${this.name}.svg`);
    sprite.scale.set(2);
    this.addChild(sprite);
    this.setNewSquare(square);
  }

  getAvailableMoves(boardState: BoardShape): void {
    const squares: Square[] = [];

    const directions: [number, number][] = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ]

    for (const direction of directions) {

      const newX = this.square.chessPosition.x + direction[0];
      const newY = this.square.chessPosition.y + direction[1];

      if (newX <= 0 || newX > 8 || newY <= 0 || newY > 8) {
        continue;
      } else {
        const squareNotation = ChessPosition.getNotation(newX, newY);
        const square = boardState.get(squareNotation);

        if (this.checkAvailableMove(square)) {
          squares.push(square);
        }
      }
    }

    for (const square of squares) {
      square.on('click', () => square.setSquareCallBack(this));
      square.addHighlight(this);
    }

    this.availableMoves = squares;
  }

  checkAvailableMove(square: Square): boolean {
    return square.state?.color !== this.color;
  }
}