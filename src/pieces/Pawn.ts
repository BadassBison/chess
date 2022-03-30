import { Sprite } from 'pixi.js';
import { BoardShape } from '../board/Board';
import { Square } from '../board/Square';
import { ChessPosition } from '../utils/ChessPosition';
import { Piece } from './Piece';

export class Pawn extends Piece {

  constructor(color: 'white' | 'black', square: Square) {
    super(square);
    this.name = `${color}-pawn`;
    this.color = color;

    const sprite = Sprite.from(`img/${this.name}.svg`);
    sprite.scale.set(2);
    this.addChild(sprite);
    this.setNewSquare(square);
  }

  getAvailableMoves(boardState: BoardShape): void {
    const squares: Square[] = [];

    // Check for opponenct pieces in the diagnols
    const leftX = this.square.chessPosition.x - 1 > 0;
    const rightX = this.square.chessPosition.x + 1 <= 8;
    if (this.color === 'white') {

      // Only available if enenmy present
      if (leftX) { // Out of bounds check
        const topLeftNotation = ChessPosition.getNotation(this.square.chessPosition.x - 1, this.square.chessPosition.y + 1);
        const topLeftSquare = boardState.get(topLeftNotation);
        if (this.checkAvailableMove(topLeftSquare, false)) { squares.push(topLeftSquare) }
      }

      if (rightX) { // Out of bounds check
        const topRightNotation = ChessPosition.getNotation(this.square.chessPosition.x + 1, this.square.chessPosition.y + 1);
        const topRightSquare = boardState.get(topRightNotation);
        if (this.checkAvailableMove(topRightSquare, false)) { squares.push(topRightSquare) }
      }

      // Only available if no enemy present
      const topNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y + 1);
      const topSquare = boardState.get(topNotation);
      if (this.checkAvailableMove(topSquare, true)) {
        squares.push(topSquare);

        if (!this.hasMoved) {
          const doubleTopNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y + 2);
          const doubleTopSquare = boardState.get(doubleTopNotation);
          if (this.checkAvailableMove(doubleTopSquare, true)) { squares.push(doubleTopSquare) }
        }
      }

    } else {

      // Only available if enenmy present
      if (leftX) { // Out of bounds check
        const bottomLeftNotation = ChessPosition.getNotation(this.square.chessPosition.x - 1, this.square.chessPosition.y - 1);
        const bottomLeftSquare = boardState.get(bottomLeftNotation);
        if (this.checkAvailableMove(bottomLeftSquare, false)) { squares.push(bottomLeftSquare) }
      }

      if (rightX) { // Out of bounds check
        const bottomRightNotation = ChessPosition.getNotation(this.square.chessPosition.x + 1, this.square.chessPosition.y - 1);
        const bottomRightSquare = boardState.get(bottomRightNotation);
        if (this.checkAvailableMove(bottomRightSquare, false)) { squares.push(bottomRightSquare) }
      }

      // Only available if no enemy present
      const bottomNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y - 1);
      const bottomSquare = boardState.get(bottomNotation);
      if (this.checkAvailableMove(bottomSquare, true)) {
        squares.push(bottomSquare);

        if (!this.hasMoved) {
          const doubleBottomNotation = ChessPosition.getNotation(this.square.chessPosition.x, this.square.chessPosition.y - 2);
          const doubleBottomSquare = boardState.get(doubleBottomNotation);
          if (this.checkAvailableMove(doubleBottomSquare, true)) { squares.push(doubleBottomSquare) }
        }
      }

    }

    for (const square of squares) {
      square.on('click', () => square.setSquareCallBack(this));
      square.addHighlight(this);
    }

    this.availableMoves = squares;

  }

  checkAvailableMove(square: Square, open: boolean): boolean {
    if (open) {
      return square.state == null;
    } else {
      return square.state != null && square.state.color !== this.color;
    }
  }
}