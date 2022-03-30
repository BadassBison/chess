import { Sprite } from 'pixi.js';
import { BoardShape } from '../board/Board';
import { Square } from '../board/Square';
import { ChessPosition } from '../utils/ChessPosition';
import { Piece } from './Piece';

export class Knight extends Piece {

  constructor(color: 'white' | 'black', square: Square) {
    super(square);
    this.name = `${color}-knight`;
    this.color = color;

    const sprite = Sprite.from(`img/${this.name}.svg`);
    sprite.scale.set(2);
    this.addChild(sprite);
    this.setNewSquare(square);
  }

  getAvailableMoves(boardState: BoardShape): void {
    const squares: Square[] = [];

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
      if (move[0] <= 0 || move[0] > 8 || move[1] <= 0 || move[1] > 8) continue;

      const squareNotation = ChessPosition.getNotation(...move);
      const square = boardState.get(squareNotation);
      if (this.checkAvailableMove(square)) { squares.push(square) }
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