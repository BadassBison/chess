import { Square } from '../board/Square';
import { ChessPosition } from '../board/ChessPosition';
import { Piece } from './Piece';
import { BoardShape, IBoardOptions } from '../models';

export class Pawn extends Piece {

  promotionCB: (pawn: Piece) => void;

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IBoardOptions, promotionCB?: (pawn: Piece) => void) {
    super(pieceName, color, square, options);
    this.promotionCB = promotionCB;
  }

  move(square: Square): Piece {
    const attackedPiece = super.move(square);

    if (square.chessPosition.row === 1 || square.chessPosition.row === 8) {
      this.promotionCB(this);
    }

    return attackedPiece;
  }


  setAvailableMoves(boardState: BoardShape): void {
    this.availableMoves = [];
    this.attackingMoves = [];

    // Check for opponenct pieces in the diagnols
    const leftSquareInBounds = this.square.chessPosition.x - 1 > 0;
    const rightSquareInBounds = this.square.chessPosition.x + 1 <= 8;
    if (this.color === 'white') {

      // Only available if enenmy present
      if (leftSquareInBounds) { // Out of bounds check
        const topLeftNotation = ChessPosition.getNotation(this.square.chessPosition.x - 1, this.square.chessPosition.y + 1);
        const topLeftSquare = boardState.get(topLeftNotation);
        this.attackingMoves.push(topLeftSquare);
      }

      if (rightSquareInBounds) { // Out of bounds check
        const topRightNotation = ChessPosition.getNotation(this.square.chessPosition.x + 1, this.square.chessPosition.y + 1);
        const topRightSquare = boardState.get(topRightNotation);
        this.attackingMoves.push(topRightSquare);
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
        this.attackingMoves.push(bottomLeftSquare);
      }

      if (rightSquareInBounds) {
        const bottomRightNotation = ChessPosition.getNotation(this.square.chessPosition.x + 1, this.square.chessPosition.y - 1);
        const bottomRightSquare = boardState.get(bottomRightNotation);
        this.attackingMoves.push(bottomRightSquare);
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

    this.updateSquareAttackingPieces(this.attackingMoves);

    for (const attackableSquare of this.attackingMoves) {
      if (attackableSquare.piece && attackableSquare.piece.color !== this.color) {
        this.availableMoves.push(attackableSquare);
      }
    }

  }

  checkAvailableMove(square: Square): boolean {
    return square.piece == null;
  }
}