import { Square } from '../board/Square';
import { ChessPosition } from '../board/ChessPosition';
import { Piece } from './Piece';
import { BoardShape, IGameOptions, Player } from '../models';

export class Pawn extends Piece {

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IGameOptions) {
    super(pieceName, color, square, options);
  }

  setAvailableMoves(boardState: BoardShape): void {
    this.availableMoves = [];
    this.attackableSquares = [];

    // Check for opponenct pieces in the diagnols
    const leftSquareInBounds = this.square.chessPosition.x - 1 > 0;
    const rightSquareInBounds = this.square.chessPosition.x + 1 <= 8;
    if (this.color === 'white') {

      // Only available if enenmy present
      if (leftSquareInBounds) { // Out of bounds check
        const topLeftNotation = ChessPosition.getNotation(this.square.chessPosition.x - 1, this.square.chessPosition.y + 1);
        const topLeftSquare = boardState.get(topLeftNotation);
        this.attackableSquares.push(topLeftSquare);
      }

      if (rightSquareInBounds) { // Out of bounds check
        const topRightNotation = ChessPosition.getNotation(this.square.chessPosition.x + 1, this.square.chessPosition.y + 1);
        const topRightSquare = boardState.get(topRightNotation);
        this.attackableSquares.push(topRightSquare);
      }

      // Only available if no enemy present
      const topNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y + 1);
      const topSquare = boardState.get(topNotation);
      if (this.checkAvailableMove(topSquare)) {
        this.availableMoves.push(topSquare);

        if (!this.hasMoved) {
          const doubleTopNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y + 2);
          const doubleTopSquare = boardState.get(doubleTopNotation);
          if (this.checkAvailableMove(doubleTopSquare)) { this.availableMoves.push(doubleTopSquare) }
        }
      }

    } else {

      // Only available if enenmy present
      if (leftSquareInBounds) {
        const bottomLeftNotation = ChessPosition.getNotation(this.square.chessPosition.x - 1, this.square.chessPosition.y - 1);
        const bottomLeftSquare = boardState.get(bottomLeftNotation);
        this.attackableSquares.push(bottomLeftSquare);
      }

      if (rightSquareInBounds) {
        const bottomRightNotation = ChessPosition.getNotation(this.square.chessPosition.x + 1, this.square.chessPosition.y - 1);
        const bottomRightSquare = boardState.get(bottomRightNotation);
        this.attackableSquares.push(bottomRightSquare);
      }

      // Only available if no enemy present
      const bottomNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y - 1);
      const bottomSquare = boardState.get(bottomNotation);
      if (this.checkAvailableMove(bottomSquare)) {
        this.availableMoves.push(bottomSquare);

        if (!this.hasMoved) {
          const doubleBottomNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y - 2);
          const doubleBottomSquare = boardState.get(doubleBottomNotation);
          if (this.checkAvailableMove(doubleBottomSquare)) { this.availableMoves.push(doubleBottomSquare) }
        }
      }

    }

    this.updateSquareAttackingPieces(this.attackableSquares);

    for (const attackableSquare of this.attackableSquares) {
      if (attackableSquare.state && attackableSquare.state.color !== this.color) {
        this.availableMoves.push(attackableSquare);
      }
    }

  }

  checkAvailableMove(square: Square): boolean {
    return square.state == null;
  }
}