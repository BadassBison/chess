import { Container } from '@pixi/display';
import { Piece } from '../pieces/Piece';
import { Sprite, Texture, Text, ITextStyle } from 'pixi.js';
import { ChessPosition } from './ChessPosition';
import { GlowFilter } from '@pixi/filter-glow';
import { AttackingTracker, Player, SquareData } from '../models';

export class Square extends Container {
  chessPosition: ChessPosition;
  piece: Piece | null;
  sprite: Sprite;
  hitbox: Sprite;
  notations: Text[];
  attackingPieces: Piece[];
  baseColor: number;
  selectedEmptySquareHighlight: number;
  moveableSpaceHighlight: number;
  // historyTracker: HistoryTracker;
  attackingTracker: AttackingTracker;

  constructor(squareData: SquareData) {
    super();

    const {
      row,
      column,
      boardOptions,
      startingPoint,
      squareDimensions,
      squareClickCB,
      // historyTracker,
      attackingTracker
    } = squareData;

    const {
      player,
      selectedEmptySquareColor,
      moveableSpaceColor,
      lightSquareColor,
      darkSquareColor,
    } = boardOptions;

    const isWhite = player === 'white';

    const chessColumn = isWhite ? column : 7 - column;
    const chessRow = isWhite ? 7 - row : row;
    this.chessPosition = new ChessPosition(chessColumn, chessRow);

    this.name = `square-${this.chessPosition.notation}`;
    this.notations = [];
    this.piece = null;
    this.attackingPieces = [];
    this.selectedEmptySquareHighlight = selectedEmptySquareColor;
    this.moveableSpaceHighlight = moveableSpaceColor;

    // this.historyTracker = historyTracker;
    this.attackingTracker = attackingTracker;


    let x: number;
    let y: number;

    if (isWhite) {
      x = column * squareDimensions + startingPoint.x;
      y = row * squareDimensions + startingPoint.y;
    } else {
      x = column * squareDimensions + startingPoint.x;
      y = row * squareDimensions + startingPoint.y;
    }

    this.sprite = new Sprite(Texture.WHITE);
    this.position.set(x, y);
    this.width = squareDimensions;
    this.height = squareDimensions;
    this.sprite.width = squareDimensions;
    this.sprite.height = squareDimensions;

    const isLight = (row + column) % 2 === 0;
    this.baseColor = isLight ? lightSquareColor : darkSquareColor;
    this.sprite.tint = this.baseColor;

    this.addChild(this.sprite);
    this.setupHitbox(squareClickCB);
    this.setupNotation(column, row, player);
  }

  setPiece(piece: Piece, initial: boolean): Piece {
    const attackedPiece = this.attackingTracker(this.piece);
    this.piece = piece;
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
    this.hitbox.on('pointerdown', () => { squareClickCB(this) });
  }

  setupNotation(column: number, row: number, orientation: Player) {
    const fontSize = this.width / 4;
    if (column === 0) {
      const rowContent = orientation === 'white' ? `${8 - row}` : `${row + 1}`;
      this.notations.push(new Text(rowContent, { fontSize }));
      this.notations[0].anchor.set(0, 1);
      this.notations[0].position.set(this.x + 1, this.y + this.height);
    }

    if (row === 0) {
      const columnContent = orientation === 'white' ? ChessPosition.columnRef[column] : ChessPosition.columnRef[7 - column];
      this.notations.push(new Text(columnContent, { fontSize }));
      this.notations[this.notations.length - 1].anchor.set(1, 0);
      this.notations[this.notations.length - 1].position.set(this.x + this.width - 2, this.y - 2);
    }
  }

  orderDisplay(): void {
    const parent = this.parent;

    parent.setChildIndex(this, parent.children.length - 1);
    if (this.piece) {
      parent.setChildIndex(this.piece, parent.children.length - 1);
    }

    if (this.notations.length > 0) {
      for (const notation of this.notations) {
        parent.setChildIndex(notation, parent.children.length - 1);
      }
    }

    parent.setChildIndex(this.hitbox, parent.children.length - 1);
  }

  AddAllHighlights(): void {
    if (this.piece) {
      this.piece.showAvailableMovesHighlights();
      this.piece.addSelectedHighlight();
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
      if (this.piece && this.piece.color !== piece.color) {
        // if this square has a piece, and it does not match the attacker
        piece.addAttackerHighlight();
      } else if (!this.piece) {
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

    if (this.piece) {
      this.piece.removeHighlight();
      this.piece.removeAvailableMovesHighlights()
    }
  }
}