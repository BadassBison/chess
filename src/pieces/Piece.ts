import { GlowFilter } from '@pixi/filter-glow';
import { Container, Sprite } from 'pixi.js';
import { ChessPosition } from '../board/ChessPosition';
import { Square } from '../board/Square';
import { BoardShape, IGameOptions, Player } from '../models';
import { newGame } from '../board/shapes/newGame'

export abstract class Piece extends Container {
  color: Player;
  selectedHighlight: number;
  attackerHighlight: number;
  square: Square;
  hasMoved: boolean;
  availableMoves: Square[];
  attackableSquares: Square[];
  sprite: Sprite;

  constructor(pieceName: string, color: 'white' | 'black', square: Square, options: IGameOptions) {
    super();
    this.name = pieceName;
    this.color = color;
    this.selectedHighlight = options.selectedPieceColor;
    this.attackerHighlight = options.attackerPieceColor;
    this.interactive = true;
    this.availableMoves = [];
    this.attackableSquares = [];

    this.buildSprite();
    this.setNewSquare(square, true);
    this.hasMoved = newGame[this.name] !== this.square.chessPosition.notation;
  }

  setNewSquare(square: Square, initial = false): Piece {
    this.square = square;
    this.position.set(square.x, square.y);
    const attackedPiece = square.setPiece(this, initial);

    return attackedPiece;
  };

  move(square: Square): Piece {
    this.hasMoved = true;
    const oldSquare = this.square;
    oldSquare.state = null;

    // Remove this piece as an attackingPiece on all previous attacking squares
    for (const oldPosition of this.availableMoves) {
      oldPosition.attackingPieces = oldPosition.attackingPieces.filter((piece: Piece) => piece !== this);
    }

    const attackedPiece = this.setNewSquare(square);

    return attackedPiece;
  };

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

  removeHighlight(): void {
    this.filters = null;
  }

  getImgPath(): string {
    const numIdx = this.name.search(/[0-9]/);

    return numIdx > 0 ? `img/${this.name.slice(0, numIdx)}.svg` : `img/${this.name}.svg`;
  }

  buildSprite(): void {
    this.sprite = Sprite.from(this.getImgPath());
    this.sprite.scale.set(2);
    this.addChild(this.sprite);
  }

  showAvailableMoves(): void {
    for (const square of this.availableMoves) {
      square.addMoveableSpaceHighlight();
    }
  }

  removeAvailableMovesHighlights(): void {
    for (const square of this.availableMoves) {
      square.removeHighlight();
    }
  }

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

  abstract setAvailableMoves(boardState: BoardShape): void;
  abstract checkAvailableMove(square: Square, open: boolean): boolean;
}