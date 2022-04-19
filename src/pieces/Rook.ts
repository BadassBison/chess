import { Square } from '../board/Square';
import { ChessPosition } from '../board/ChessPosition';
import { Piece } from './Piece';
import { BoardShape, IBoardOptions } from '../models';
import { outOfBounds } from '../utils/outOfBounds';

export class Rook extends Piece {

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IBoardOptions) {
    super(pieceName, color, square, options);
  }

  setAvailableMoves(boardState: BoardShape): void {
    this.availableMoves = [];
    this.attackingMoves = [];

    const directions: [number, number][] = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ]

    for (const direction of directions) {
      let currentX = this.square.chessPosition.x;
      let currentY = this.square.chessPosition.y;

      let moving = true;
      while (moving) {
        const newX = currentX += direction[0];
        const newY = currentY += direction[1];

        if (outOfBounds(newX, newY)) {
          moving = false;
        } else {
          const squareNotation = ChessPosition.getNotation(newX, newY);
          const square = boardState.get(squareNotation);

          if (this.checkAvailableMove(square)) {
            this.availableMoves.push(square);
            moving = square.piece == null; // Only moving if opponent was not attacked
          } else {
            moving = false;
          }
        }
      }
    }

    this.updateSquareAttackingPieces(this.availableMoves);

    this.attackingMoves = this.availableMoves;
  }

  checkAvailableMove(square: Square): boolean {
    return square.piece?.color !== this.color;
  }
}