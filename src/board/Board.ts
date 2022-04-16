import { Container, Point, Text } from 'pixi.js';
import { King, Queen, Rook, Bishop, Knight, Pawn, Piece } from '../pieces';
import { GameShape } from './shapes';
import { Square } from './Square';
import { ChessPosition } from './ChessPosition';
import { BoardShape, HistoryTracker, HistoryTrackerOptions, IGameOptions, MoveTracker, Player, SquareData } from '../models';
import { onKeyPress } from '../utils/onKeyPress';
import { GameHistory } from '../history/GameHistory';



export class Board extends Container {
  static build(gameShape: GameShape, gameOptions: IGameOptions, historyTracker: HistoryTracker): Board {
    return new Board(gameShape, gameOptions, historyTracker);
  }

  boardShape: BoardShape;
  boardPieces: Piece[];
  currentlySelectedSquare: Square;
  squareDimensions: number;
  startingPoint: Point;
  gameOptions: IGameOptions;
  notationRow: Text[];
  notationColumn: Text[];
  historyTracker: HistoryTracker;

  constructor(gameShape: GameShape, options: IGameOptions, historyTracker: HistoryTracker) {
    super();

    this.boardShape = new Map<string, Square>();
    this.gameOptions = options;
    this.historyTracker = ({ move }: HistoryTrackerOptions) => historyTracker({ move, boardShape: this.boardShape });
    this.buildSquares();
    this.buildNotations();
    this.placePieces(gameShape);
    this.trackInitialShape();
    this.setAvailableMoves();
  }

  buildSquares() {
    this.calculateDimensions();

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {

        const squareData: SquareData = {
          gameOptions: this.gameOptions,
          row,
          column,
          startingPoint: this.startingPoint,
          squareDimensions: this.squareDimensions,
          squareClickCB: (square: Square) => this.handleSquareClick(square),
          historyTracker: this.historyTracker,
          attackingTracker: (attackedPiece: Piece) => this.trackAttack(attackedPiece)
        }

        const newSquare = new Square(squareData);
        this.boardShape.set(newSquare.chessPosition.notation, newSquare);

        this.addChild(newSquare);
        this.addChild(newSquare.hitbox);
      }
    }
  }

  flipBoard(history: GameHistory) {
    const lastGameState = history.getHistory().gameShape[history.getHistory().gameShape.length - 1];

    const parent = this.parent;
    parent.removeChild(this);
    for (const notations of [...this.notationRow, ...this.notationColumn]) {
      this.removeChild(notations);
    }

    this.boardShape = new Map<string, Square>();
    this.gameOptions.player = this.gameOptions.player === 'white' ? 'black' : 'white';
    this.buildSquares();
    this.buildNotations();

    this.placePieces(lastGameState);

    parent.addChild(this);
  }

  buildNotations() {
    this.notationRow = [];
    this.notationColumn = [];

    const fontSize = this.squareDimensions / 4;
    const isWhite = this.gameOptions.player === 'white';

    for (let i = 0; i < 8; i++) {

      const rowContent = isWhite ? `${8 - i}` : `${i + 1}`;
      this.notationRow.push(new Text(rowContent, { fontSize }));
      const rowX = (this.startingPoint.x - this.squareDimensions / 2);
      const rowY = (this.startingPoint.y + (this.squareDimensions - this.notationRow[i].height) / 2) + (i * this.squareDimensions);
      this.notationRow[i].position.set(rowX, rowY);

      const columnContent = isWhite ? ChessPosition.columnRef[i] : ChessPosition.columnRef[7 - i];
      this.notationColumn.push(new Text(columnContent, { fontSize }));
      const columnX = (this.startingPoint.x + (this.squareDimensions - this.notationColumn[i].width) / 2) + (i * this.squareDimensions);
      const columnY = (this.startingPoint.y + (this.squareDimensions - this.notationColumn[i].height) / 2) - this.squareDimensions;
      this.notationColumn[i].position.set(columnX, columnY);

      this.addChild(this.notationRow[i], this.notationColumn[i]);
    }

  }

  placePieces(shape: GameShape) {
    this.boardPieces = [];

    for (const pieceName in shape) {
      const position = shape[pieceName];

      const square: Square = this.boardShape.get(position);

      const piece = this.setPiece(pieceName, square, this.gameOptions);
      this.boardPieces.push(piece);
      this.addChild(piece);

      square.orderDisplay();
    }
  }

  promotion(pawn: Piece): void {
    const square = pawn.square;
    const pawnIdx = this.boardPieces.findIndex((piece: Piece) => piece === pawn);
    this.removeChild(pawn);

    const color = pawn.name.includes('white') ? 'white' : 'black';
    const queen = new Queen(`${color}Queen`, pawn.color, square, this.gameOptions);
    this.boardPieces[pawnIdx] = queen;
    this.addChild(queen);

    square.orderDisplay();
  }

  castle(rook: Piece): void {

    const row = rook.square.chessPosition.row;

    if (rook.square.chessPosition.column === 1) {
      const newPositionNotation = ChessPosition.getNotation(4, row);
      const newRookPosition: Square = this.boardShape.get(newPositionNotation);

      rook.move(newRookPosition);

    } else if (rook.square.chessPosition.column === 8) {
      const newPositionNotation = ChessPosition.getNotation(6, row);
      const newRookPosition: Square = this.boardShape.get(newPositionNotation);

      rook.move(newRookPosition);
    }
  }

  setPiece(pieceName: string, square: Square, options: IGameOptions): Piece {
    const color = pieceName.includes('white') ? 'white' : 'black';

    switch (pieceName) {
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
      case 'blackPawn8': return new Pawn(pieceName, color, square, options, (pawn: Piece): void => { this.promotion(pawn) });
      case 'whiteRook1':
      case 'whiteRook2':
      case 'blackRook1':
      case 'blackRook2': return new Rook(pieceName, color, square, options);
      case 'whiteBishop1':
      case 'whiteBishop2':
      case 'blackBishop1':
      case 'blackBishop2': return new Bishop(pieceName, color, square, options);
      case 'whiteKnight1':
      case 'whiteKnight2':
      case 'blackKnight1':
      case 'blackKnight2': return new Knight(pieceName, color, square, options);
      case 'whiteQueen':
      case 'blackQueen': return new Queen(pieceName, color, square, options);
      case 'whiteKing':
      case 'blackKing': return new King(pieceName, color, square, options, (rook: Piece): void => { this.castle(rook) });
    }
  }

  handleSquareClick(newSelectedSquare: Square): void {
    const selectedSquare = this.currentlySelectedSquare !== newSelectedSquare;
    const deselectedSquare = this.currentlySelectedSquare === newSelectedSquare;

    const piece = this.currentlySelectedSquare?.piece;

    const hasPiece = !!piece;
    const isAvailableMove = hasPiece ? piece.availableMoves.includes(newSelectedSquare) : false;
    const isMove = selectedSquare && isAvailableMove;

    if (isMove) {
      this.currentlySelectedSquare.removeAllHighlights();

      const oldPosition = piece.getPosition() as string;

      const attackedPiece = piece.move(newSelectedSquare);

      const move: MoveTracker = {
        pieceName: piece.name,
        oldPosition,
        newPosition: piece.getPosition() as string,
        ...(attackedPiece ? { attackedPiece: attackedPiece.name } : {})
      }

      this.historyTracker({ move });

      this.setAvailableMoves();

    } else if (selectedSquare) {

      // Selected a different square
      if (this.currentlySelectedSquare) {
        this.currentlySelectedSquare.removeAllHighlights();
      }

      this.currentlySelectedSquare = newSelectedSquare;
      this.currentlySelectedSquare.AddAllHighlights();

    } else if (deselectedSquare) {
      this.currentlySelectedSquare.removeAllHighlights();
      this.currentlySelectedSquare = null;

    } else {
      console.error('THIS SHOULD NOT HAPPEN');
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
    return this.boardShape.get(position);
  }

  trackInitialShape(): void {
    this.historyTracker
  }

  trackAttack(attackedPiece: Piece): Piece {
    let piece: Piece;

    if (attackedPiece) {
      this.removeChild(attackedPiece);
      this.boardPieces = this.boardPieces.filter((p: Piece) => p !== attackedPiece);

      piece = attackedPiece;
    }

    return piece;
  }

  removeSquareAttackingPieces(): void {
    for (const [notation, square] of this.boardShape) {
      square.attackingPieces = [];
    }
  }

  setAvailableMoves(): void {
    this.removeSquareAttackingPieces();

    for (const piece of this.boardPieces) {
      piece.setAvailableMoves(this.boardShape);
    }
  }

  clear(): void {
    for (const piece of this.boardPieces) {
      this.removeChild(piece);
    }
  }
}