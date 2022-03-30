import { Sprite } from 'pixi.js';
import { BoardShape } from '../board/Board';
import { Square } from '../board/Square';
import { ChessPosition } from '../utils/ChessPosition';
import { Piece } from './Piece';

export class Queen extends Piece {

  constructor(color: 'white' | 'black', square: Square) {
    super(square);
    this.name = `${color}-queen`;
    this.color = color;

    const sprite = Sprite.from(`img/${this.name}.svg`);
    sprite.scale.set(2);
    this.addChild(sprite);
    this.setNewSquare(square);
  }

  getAvailableMoves(boardState: BoardShape): void {
    const squares: Square[] = [];

    const directions: [number, number][] = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ]

    for (const direction of directions) {
      let currentX = this.square.chessPosition.x;
      let currentY = this.square.chessPosition.y;

      let available = true;
      while (available) {
        const newX = currentX += direction[0];
        const newY = currentY += direction[1];

        if (newX <= 0 || newX > 8 || newY <= 0 || newY > 8) {
          available = false;
        } else {
          const squareNotation = ChessPosition.getNotation(newX, newY);
          const square = boardState.get(squareNotation);

          if (this.checkAvailableMove(square)) {
            squares.push(square);
            available = square.state == null; // No longer available if hit opponent
          } else {
            available = false;
          }
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