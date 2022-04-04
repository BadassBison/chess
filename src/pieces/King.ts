import { Square } from '../board/Square';
import { ChessPosition } from '../board/ChessPosition';
import { Piece } from './Piece';
import { BoardShape, IGameOptions, Player } from '../models';
import { outOfBounds } from '../utils/outOfBounds';
import { Rook } from './Rook';

export class King extends Piece {

  castleMoves: Map<Square, Piece>;
  castleCB: (rook: Piece) => void;

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IGameOptions, castleCB?: (rook: Piece) => void) {
    super(pieceName, color, square, options);
    this.castleCB = castleCB;
  }

  move(square: Square): Piece {
    const attackingPiece = super.move(square);

    if (this.castleMoves.has(square)) {
      const rook = this.castleMoves.get(square);
      this.castleCB(rook);
    }

    return attackingPiece;
  }

  setAvailableMoves(boardState: BoardShape): void {
    this.availableMoves = [];
    this.attackableSquares = [];
    this.castleMoves = new Map<Square, Piece>();

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

      if (outOfBounds(newX, newY)) {
        continue;
      } else {
        const squareNotation = ChessPosition.getNotation(newX, newY);
        const square = boardState.get(squareNotation);

        if (this.checkAvailableMove(square)) {
          this.attackableSquares.push(square);
        }
      }
    }

    this.updateSquareAttackingPieces(this.attackableSquares);
    this.availableMoves = this.attackableSquares;

    // TODO: Check if we can castle
    if (!this.hasMoved) {
      const x = this.square.chessPosition.x;
      const y = this.square.chessPosition.y;

      // FIXME:
      if (this.checkAvailableCastleRight(boardState, x, y)) {
        const square = boardState.get(ChessPosition.getNotation(x + 2, y));
        const rook = boardState.get(ChessPosition.getNotation(x + 3, y)).state;

        this.availableMoves.push(square);
        this.castleMoves.set(square, rook);
      }

      if (this.checkAvailableCastleLeft(boardState, x, y)) {
        const square = boardState.get(ChessPosition.getNotation(x - 2, y));
        const rook = boardState.get(ChessPosition.getNotation(x - 4, y)).state;

        this.castleMoves.set(square, rook);
        this.availableMoves.push(square);
      }
    }
  }

  checkAvailableMove(square: Square): boolean {
    // TODO: Can not move onto a square where you will have check
    return square.state?.color !== this.color;
  }

  checkAvailableCastleRight(boardState: BoardShape, x: number, y: number): boolean {
    const castleRightPositionChecks = [
      [1, 0],
      [2, 0]
    ];

    const rightRookHasMoved = boardState.get(ChessPosition.getNotation(x + 3, y))?.state?.hasMoved;

    if (!rightRookHasMoved) {

      // Check if spaces are free to the rook
      let castleAvailable = true;
      for (const position of castleRightPositionChecks) {
        if (!castleAvailable) break;

        const newX = this.square.chessPosition.x + position[0];
        const newY = this.square.chessPosition.y + position[1];

        castleAvailable = boardState.get(ChessPosition.getNotation(newX, newY)).state == null;
      }

      return castleAvailable;
    }
    return false;
  }

  checkAvailableCastleLeft(boardState: BoardShape, x: number, y: number): boolean {
    const castleLeftPositionChecks = [
      [-1, 0],
      [-2, 0],
      [-3, 0]
    ];

    const leftRookHasMoved = boardState.get(ChessPosition.getNotation(x - 4, y))?.state?.hasMoved;

    if (!leftRookHasMoved) {

      // Check if spaces are free to the rook
      let castleAvailable = true;
      for (const position of castleLeftPositionChecks) {
        if (!castleAvailable) break;

        const newX = this.square.chessPosition.x + position[0];
        const newY = this.square.chessPosition.y + position[1];

        castleAvailable = boardState.get(ChessPosition.getNotation(newX, newY)).state == null;
      }
      return castleAvailable;
    }
    return false;
  }

  triggerCastle(): void {

  }
}