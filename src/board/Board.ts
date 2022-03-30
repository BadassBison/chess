import { Container, Point, Text } from 'pixi.js';
import { Bishop } from '../pieces/Bishop';
import { King } from '../pieces/King';
import { Knight } from '../pieces/Knight';
import { Pawn } from '../pieces/Pawn';
import { Piece } from '../pieces/Piece';
import { Queen } from '../pieces/Queen';
import { Rook } from '../pieces/Rook';
import { makeDraggable } from '../utils/makeDraggable';
import { Position } from '../utils/position';
import { shapes } from './shapes';
import { GameShape } from './shapes/GameShape';
import { Square } from './Square';

type BoardShape = Map<string, Square>

export class Board extends Container {
  static build(gameShapeName: string = 'newGame'): Board {
    const shape: GameShape = shapes[gameShapeName]();
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

        const newSquare = new Square(row, column, this.startingPoint, this.squareDimensions, (square: Square) => {
          if (this.currentlySelectedPiece) {
            this.currentlySelectedPiece.move(square);

            this.currentlySelectedPiece.filters = null;
            this.currentlySelectedPiece = null;
          }
        });
        this.state.set(newSquare.chessPosition, newSquare);

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

      const labelColumn = new Text(Square.columnRef[i], {
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

      this.setPiece(pieceName, square, (piece: Piece) => {
        this.setChildIndex(piece.square, this.children.length - 1);
        this.currentlySelectedPiece = piece;
      });
    }
  }

  setPiece(piece: string, square: Square, cb: Function): Piece {
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
      case 'blackPawn8': return new Pawn(color, square, cb);
      case 'whiteRook1':
      case 'whiteRook2':
      case 'blackRook1':
      case 'blackRook2': return new Rook(color, square, cb);
      case 'whiteBishop1':
      case 'whiteBishop2':
      case 'blackBishop1':
      case 'blackBishop2': return new Bishop(color, square, cb);
      case 'whiteKnight1':
      case 'whiteKnight2':
      case 'blackKnight1':
      case 'blackKnight2': return new Knight(color, square, cb);
      case 'whiteQueen':
      case 'blackQueen': return new Queen(color, square, cb);
      case 'whiteKing':
      case 'blackKing': return new King(color, square, cb);
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