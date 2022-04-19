import { GlowFilter } from '@pixi/filter-glow';
import { Container, Sprite } from 'pixi.js';
import { ChessPosition } from '../board/ChessPosition';
import { Square } from '../board/Square';
import { BoardShape, IBoardOptions, Player } from '../models';
import { newGame } from '../board/shapes/newGame'

export abstract class Piece extends Container {
  color: Player;
  selectedHighlight: number;
  attackerHighlight: number;
  square: Square;
  hasMoved: boolean;
  availableMoves: Square[];
  attackingMoves: Square[];
  sprite: Sprite;

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IBoardOptions) {
    super();
    this.name = pieceName;
    this.color = color;
    this.selectedHighlight = options.selectedPieceColor;
    this.attackerHighlight = options.attackerPieceColor;
    this.interactive = true;
    this.availableMoves = [];
    this.attackingMoves = [];

    this.buildSprite(square.width);
    this.setNewSquare(square, true);
    this.hasMoved = newGame[this.name] !== this.square.chessPosition.notation;
  }

  abstract setAvailableMoves(boardState: BoardShape): void;
  abstract checkAvailableMove(square: Square, open: boolean): boolean;

  move(square: Square): Piece {
    this.hasMoved = true;
    this.square.piece = null;

    const attackedPiece = this.setNewSquare(square);

    return attackedPiece;
  };

  setNewSquare(square: Square, initial = false): Piece {
    this.square = square;
    this.position.set(square.x, square.y);
    const attackedPiece = square.setPiece(this, initial);

    return attackedPiece;
  };

  getPosition(fullChessPosition: boolean = false): ChessPosition | string {
    if (fullChessPosition) {
      return this.square.chessPosition;
    } else {
      return this.square.chessPosition.notation;
    }
  }

  updateSquareAttackingPieces(squares: Square[]): void {
    for (const square of squares) {
      if (square !== this.square) {
        square.attackingPieces.push(this);
      }
    }
  }

  getImgPath(): string {
    const numIdx = this.name.search(/[0-9]/);

    return numIdx > 0 ? `img/${this.name.slice(0, numIdx)}.svg` : `img/${this.name}.svg`;
  }

  buildSprite(dimensions: number): void {
    this.sprite = Sprite.from(this.getImgPath());
    this.sprite.width = dimensions;
    this.sprite.height = dimensions;
    this.addChild(this.sprite);
  }

  addSelectedHighlight(): void {
    this.filters = [
      new GlowFilter({
        outerStrength: 2.6,
        distance: 12,
        color: this.selectedHighlight,
      }),
    ];
  }

  addAttackerHighlight(): void {
    this.filters = [
      new GlowFilter({
        outerStrength: 3.6,
        distance: 12,
        color: this.attackerHighlight,
      }),
    ];
  }

  showAvailableMovesHighlights(): void {
    for (const square of this.availableMoves) {
      square.addMoveableSpaceHighlight();
    }
  }

  removeAvailableMovesHighlights(): void {
    for (const square of this.availableMoves) {
      square.removeHighlight();
    }
  }

  removeHighlight(): void {
    this.filters = null;
  }
}