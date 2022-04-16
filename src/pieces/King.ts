import { Square } from '../board/Square';
import { ChessPosition } from '../board/ChessPosition';
import { Piece } from './Piece';
import { BoardShape, CastleCB, IGameOptions, PieceColor, Player } from '../models';
import { outOfBounds } from '../utils/outOfBounds';
import { Rook } from './Rook';

export class King extends Piece {

  castleMoves: Map<Square, Piece>;
  castleCB: (rook: Piece) => void;

  constructor(pieceName: string, color: PieceColor, square: Square, options: IGameOptions, castleCB: CastleCB) {
    super(pieceName, color, square, options);
    this.castleCB = castleCB;
  }

  move(square: Square): Piece {
    const attackedPiece = super.move(square);

    if (this.castleMoves.has(square)) {
      this.triggerCastle(square);
    }

    return attackedPiece;
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

    for (const [xDirection, yDirection] of directions) {

      const newX = this.square.chessPosition.x + xDirection;
      const newY = this.square.chessPosition.y + yDirection;

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
    this.getCastleMoves(boardState);
  }

  checkAvailableMove(square: Square): boolean {
    // if (this.color === 'white') {
    //   console.log({ square });
    // }
    const noPieceOfTheSameColor = square.piece?.color !== this.color;
    const noCheck = !(square.attackingPieces.find((piece: Piece) => {
      return this.color !== piece.color;
    }));
    return noPieceOfTheSameColor && noCheck;
  }

  checkAvailableCastleRight(boardState: BoardShape, x: number, y: number): boolean {
    const castleRightPositionChecks = [
      [1, 0],
      [2, 0]
    ];

    const rightRookHasMoved = boardState.get(ChessPosition.getNotation(x + 3, y))?.piece?.hasMoved;

    if (!rightRookHasMoved) {

      // Check if spaces are free to the rook
      let castleAvailable = true;
      for (const [xDirection, yDirection] of castleRightPositionChecks) {
        if (!castleAvailable) break;

        const newX = this.square.chessPosition.x + xDirection;
        const newY = this.square.chessPosition.y + yDirection;

        castleAvailable = boardState.get(ChessPosition.getNotation(newX, newY)).piece == null;
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

    const leftRookHasMoved = boardState.get(ChessPosition.getNotation(x - 4, y))?.piece?.hasMoved;

    if (!leftRookHasMoved) {

      // Check if spaces are free to the rook
      let castleAvailable = true;
      for (const [xDirection, yDirection] of castleLeftPositionChecks) {
        if (!castleAvailable) break;

        const newX = this.square.chessPosition.x + xDirection;
        const newY = this.square.chessPosition.y + yDirection;

        castleAvailable = boardState.get(ChessPosition.getNotation(newX, newY)).piece == null;
      }
      return castleAvailable;
    }
    return false;
  }

  getCastleMoves(boardState: BoardShape): void {
    if (!this.hasMoved) {
      const x = this.square.chessPosition.x;
      const y = this.square.chessPosition.y;

      if (this.checkAvailableCastleRight(boardState, x, y)) {
        const square = boardState.get(ChessPosition.getNotation(x + 2, y));
        const rook = boardState.get(ChessPosition.getNotation(x + 3, y)).piece;

        this.availableMoves.push(square);
        this.castleMoves.set(square, rook);
      }

      if (this.checkAvailableCastleLeft(boardState, x, y)) {
        const square = boardState.get(ChessPosition.getNotation(x - 2, y));
        const rook = boardState.get(ChessPosition.getNotation(x - 4, y)).piece;

        this.castleMoves.set(square, rook);
        this.availableMoves.push(square);
      }
    }
  }

  triggerCastle(square: Square): void {
    const rook = this.castleMoves.get(square);
    this.castleCB(rook);
  }
}