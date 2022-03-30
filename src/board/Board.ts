import { Container, Point, Text } from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';
import { King, Queen, Rook, Bishop, Knight, Pawn, Piece } from '../pieces';
import { shapeFactory, GameShape } from './shapes';
import { Square } from './Square';
import { ChessPosition } from '../utils/ChessPosition';

export type BoardShape = Map<string, Square>

export class Board extends Container {
  static build(gameShapeName: string = 'newGame'): Board {
    const shape: GameShape = shapeFactory[gameShapeName]();
    return new Board(shape);
  }

  state: BoardShape = new Map<string, Square>();
  currentlySelectedPiece: Piece;
  squareDimensions: number;
  startingPoint: Point;

  constructor(shape: GameShape) {
    console.log('Building Board');

    super();

    this.calculateDimensions();
    this.buildSquares();
    this.buildNotations();
    this.placePieces(shape);
  }

  buildSquares() {
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {

        const newSquare = new Square(row, column, this.startingPoint, this.squareDimensions);
        this.state.set(newSquare.chessPosition.notation, newSquare);

        this.addChild(newSquare);
      }
    }
  }

  buildNotations() {
    const notationRowPos = new Point(this.startingPoint.x - (this.squareDimensions / 2), this.startingPoint.y + (this.squareDimensions / 3));
    const notationColumnPos = new Point(this.startingPoint.x + (this.squareDimensions / 2.5), this.startingPoint.y - (this.squareDimensions / 2));

    for (let i = 0; i < 8; i++) {

      const labelRow = new Text(`${8 - i}`, {
        fontSize: 24
      });
      labelRow.position.set(notationRowPos.x, notationRowPos.y);

      const labelColumn = new Text(ChessPosition.columnRef[i], {
        fontSize: 24
      });
      labelColumn.position.set(notationColumnPos.x, notationColumnPos.y);

      this.addChild(labelRow, labelColumn);

      notationRowPos.y += this.squareDimensions;
      notationColumnPos.x += this.squareDimensions;
    }
  }

  placePieces(shape: GameShape) {

    for (const pieceName in shape) {
      const position = shape[pieceName];

      const square: Square = this.state.get(position);

      const piece = this.setPiece(pieceName, square);
      this.addChild(piece);

      piece.on('click', () => {
        if (this.currentlySelectedPiece && this.currentlySelectedPiece !== piece) {
          // Selected a different piece

          this.currentlySelectedPiece.removeHighlight();

          piece.getAvailableMoves(this.state);

          this.setChildIndex(piece, this.children.length - 1);
          this.currentlySelectedPiece = piece;
          piece.addHighlight();

        } else if (this.currentlySelectedPiece) {
          // Unselected piece

          this.currentlySelectedPiece = null;
          piece.removeHighlight();
        } else {
          // Selected piece

          console.log({ piece });
          piece.getAvailableMoves(this.state);

          this.setChildIndex(piece, this.children.length - 1);
          this.currentlySelectedPiece = piece;
          piece.addHighlight();
        }

      });
    }
  }

  setPiece(piece: string, square: Square): Piece {
    const color = piece.includes('white') ? 'white' : 'black';

    switch (piece) {
      case 'whitePawn1':
      case 'whitePawn2':
      case 'whitePawn3':
      case 'whitePawn4':
      case 'whitePawn5':
      case 'whitePawn6':
      case 'whitePawn7':
      case 'whitePawn8':
      case 'blackPawn1':
      case 'blackPawn2':
      case 'blackPawn3':
      case 'blackPawn4':
      case 'blackPawn5':
      case 'blackPawn6':
      case 'blackPawn7':
      case 'blackPawn8': return new Pawn(color, square);
      case 'whiteRook1':
      case 'whiteRook2':
      case 'blackRook1':
      case 'blackRook2': return new Rook(color, square);
      case 'whiteBishop1':
      case 'whiteBishop2':
      case 'blackBishop1':
      case 'blackBishop2': return new Bishop(color, square);
      case 'whiteKnight1':
      case 'whiteKnight2':
      case 'blackKnight1':
      case 'blackKnight2': return new Knight(color, square);
      case 'whiteQueen':
      case 'blackQueen': return new Queen(color, square);
      case 'whiteKing':
      case 'blackKing': return new King(color, square);
    }
  }

  calculateDimensions() {
    const maxDim = Math.min(innerWidth, innerHeight);
    const isHorizontalScreen = maxDim === innerHeight;
    this.squareDimensions = maxDim / 10;

    if (isHorizontalScreen) {
      this.startingPoint = new Point((innerWidth - maxDim) / 2 + this.squareDimensions, this.squareDimensions);
    } else {
      this.startingPoint = new Point(this.squareDimensions, (innerHeight - maxDim) / 2 + this.squareDimensions);
    }
  }

  getSquareByPosition(position: string): Square {
    return this.state.get(position);
  }
}