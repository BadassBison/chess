import { Square } from '../board/Square';
import { ChessPosition } from '../board/ChessPosition';
import { Piece } from './Piece';
import { BoardShape, IGameOptions, Player } from '../models';
import { outOfBounds } from '../utils/outOfBounds';

export class Knight extends Piece {

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IGameOptions) {
    super(pieceName, color, square, options);
  }

  setAvailableMoves(boardState: BoardShape): void {
    this.availableMoves = [];
    this.attackableSquares = [];

    const moves: [number, number][] = [
      [this.square.chessPosition.x + 2, this.square.chessPosition.y + 1],
      [this.square.chessPosition.x + 2, this.square.chessPosition.y - 1],
      [this.square.chessPosition.x - 2, this.square.chessPosition.y + 1],
      [this.square.chessPosition.x - 2, this.square.chessPosition.y - 1],
      [this.square.chessPosition.x + 1, this.square.chessPosition.y + 2],
      [this.square.chessPosition.x + 1, this.square.chessPosition.y - 2],
      [this.square.chessPosition.x - 1, this.square.chessPosition.y + 2],
      [this.square.chessPosition.x - 1, this.square.chessPosition.y - 2],
    ]

    for (const move of moves) {
      if (outOfBounds(move[0], move[1])) { continue; }

      const squareNotation = ChessPosition.getNotation(...move);
      const square = boardState.get(squareNotation);
      if (this.checkAvailableMove(square)) { this.availableMoves.push(square) }
    }

    this.updateSquareAttackingPieces(this.availableMoves);

    this.attackableSquares = this.availableMoves;
  }

  checkAvailableMove(square: Square): boolean {
    return square.piece?.color !== this.color;
  }
}