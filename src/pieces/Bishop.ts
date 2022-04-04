import { Square } from '../board/Square';
import { ChessPosition } from '../board/ChessPosition';
import { Piece } from './Piece';
import { BoardShape, IGameOptions, Player } from '../models';
import { outOfBounds } from '../utils/outOfBounds';

export class Bishop extends Piece {

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IGameOptions) {
    super(pieceName, color, square, options);
  }

  setAvailableMoves(boardState: BoardShape): void {
    this.availableMoves = [];
    this.attackableSquares = [];

    const directions: [number, number][] = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
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
            moving = square.state == null; // Only moving if opponent was not attacked
          } else {
            moving = false;
          }
        }
      }
    }

    this.updateSquareAttackingPieces(this.availableMoves);

    this.attackableSquares = this.availableMoves;
  }

  checkAvailableMove(square: Square): boolean {
    return square.state?.color !== this.color;
  }
}