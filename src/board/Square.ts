import { Container } from '@pixi/display';
import { Piece } from '../pieces/Piece';
import { Sprite, Texture } from 'pixi.js';
import { ChessPosition } from './ChessPosition';
import { GlowFilter } from '@pixi/filter-glow';
import { AttackingTracker, HistoryTracker, SquareData } from '../models';

export class Square extends Container {
  chessPosition: ChessPosition;
  state: Piece | null;
  sprite: Sprite;
  hitbox: Sprite;
  attackingPieces: Piece[];
  baseColor: number;
  selectedEmptySquareHighlight: number;
  moveableSpaceHighlight: number;
  historyTracker: HistoryTracker;
  attackingTracker: AttackingTracker;

  constructor(squareData: SquareData) {
    super();

    const {
      row,
      column,
      gameOptions,
      startingPoint,
      squareDimensions,
      squareClickCB,
      historyTracker,
      attackingTracker
    } = squareData;

    const {
      player,
      selectedEmptySquareColor,
      moveableSpaceColor,
      lightSquareColor,
      darkSquareColor,
    } = gameOptions;

    const chessColumn = player === 'white' ? column : 7 - column;
    const chessRow = player === 'white' ? 7 - row : row;
    this.chessPosition = new ChessPosition(chessColumn, chessRow);

    this.name = `square-${this.chessPosition.notation}`;
    this.state = null;
    this.attackingPieces = [];
    this.selectedEmptySquareHighlight = selectedEmptySquareColor;
    this.moveableSpaceHighlight = moveableSpaceColor;

    this.historyTracker = historyTracker;
    this.attackingTracker = attackingTracker;


    let x: number;
    let y: number;

    if (player === 'white') {
      x = column * squareDimensions + startingPoint.x;
      y = row * squareDimensions + startingPoint.y;
    } else {
      x = column * squareDimensions + startingPoint.x;
      y = row * squareDimensions + startingPoint.y;
    }

    this.sprite = new Sprite(Texture.WHITE);
    this.position.set(x, y);
    this.sprite.width = squareDimensions;
    this.sprite.height = squareDimensions;

    const isLight = (row + column) % 2 === 0;
    this.baseColor = isLight ? lightSquareColor : darkSquareColor;
    this.sprite.tint = this.baseColor;

    this.addChild(this.sprite);
    this.setupHitbox(squareClickCB);
  }

  setPiece(piece: Piece, initial: boolean): Piece {
    const attackedPiece = this.attackingTracker(this.state);
    this.state = piece;
    if (!initial) {
      this.orderDisplay();
    }

    return attackedPiece;
  }

  setupHitbox(squareClickCB: (square: Square) => void): void {
    this.hitbox = new Sprite(Texture.EMPTY);

    this.hitbox.width = this.width;
    this.hitbox.height = this.height;
    this.hitbox.position.set(this.x, this.y);
    this.hitbox.interactive = true;
    this.hitbox.on('click', () => { squareClickCB(this) });
  }

  orderDisplay(): void {
    const parent = this.parent;

    parent.setChildIndex(this, parent.children.length - 1);
    if (this.state) {
      parent.setChildIndex(this.state, parent.children.length - 1);
    }
    parent.setChildIndex(this.hitbox, parent.children.length - 1);
  }

  AddAllHighlights(): void {
    if (this.state) {
      this.state.showAvailableMoves();
      this.state.addSelectedHighlight();
    } else {
      this.addSelectedEmptyHighlight();
    }
    this.addSelectedBorderHighlight();
    this.showAttackingPiecesHighlight();
  }

  addSelectedBorderHighlight(): void {
    this.orderDisplay();
    this.sprite.filters = [
      new GlowFilter({
        outerStrength: 2.6,
        distance: 12,
        color: this.selectedEmptySquareHighlight,
      }),
    ];
  }

  addSelectedEmptyHighlight(): void {
    this.sprite.tint = this.selectedEmptySquareHighlight;
  }

  addMoveableSpaceHighlight(): void {
    this.orderDisplay();
    this.sprite.tint = this.moveableSpaceHighlight;

    this.sprite.filters = [
      new GlowFilter({
        outerStrength: 2.6,
        distance: 12,
        color: this.moveableSpaceHighlight,
      }),
    ];
  }

  showAttackingPiecesHighlight(): void {
    for (const piece of this.attackingPieces) {
      if (this.state && this.state.color !== piece.color) {
        // if this square has a piece, and it does not match the attacker
        piece.addAttackerHighlight();
      } else if (!this.state) {
        piece.addAttackerHighlight();
      }
    }
  }

  removeAttackingPiecesHighlight(): void {
    for (const piece of this.attackingPieces) {
      piece.removeHighlight();
    }
  }

  removeHighlight(): void {
    this.sprite.tint = this.baseColor;
    this.sprite.filters = null;
  }

  removeAllHighlights(): void {
    this.removeHighlight();

    this.removeAttackingPiecesHighlight();

    if (this.state) {
      this.state.removeHighlight();
      this.state.removeAvailableMovesHighlights()
    }
  }
}