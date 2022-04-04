import { Container, Point, Text } from 'pixi.js';
import { King, Queen, Rook, Bishop, Knight, Pawn, Piece } from '../pieces';
import { GameShape } from './shapes';
import { Square } from './Square';
import { ChessPosition } from './ChessPosition';
import { BoardShape, HistoryTracker, HistoryTrackerOptions, IGameOptions, MoveTracker, Player, SquareData } from '../models';



export class Board extends Container {
  static build(gameShape: GameShape, gameOptions: IGameOptions, historyTracker: HistoryTracker): Board {
    return new Board(gameShape, gameOptions, historyTracker);
  }

  state: BoardShape;
  boardPieces: Piece[];
  currentlySelectedSquare: Square;
  squareDimensions: number;
  startingPoint: Point;
  historyTracker: HistoryTracker;

  constructor(gameShape: GameShape, options: IGameOptions, historyTracker: HistoryTracker) {
    super();

    this.state = new Map<string, Square>();
    this.historyTracker = ({ move }: HistoryTrackerOptions) => historyTracker({ move, boardShape: this.state });
    this.buildSquares(options);
    this.buildNotations(options.player);
    this.placePieces(gameShape, options);
    this.trackInitialShape();
    this.setAvailableMoves();
  }

  buildSquares(gameOptions: IGameOptions) {
    this.calculateDimensions();

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {

        const squareData: SquareData = {
          gameOptions,
          row,
          column,
          startingPoint: this.startingPoint,
          squareDimensions: this.squareDimensions,
          squareClickCB: (square: Square) => this.handleSquareClick(square),
          historyTracker: this.historyTracker,
          attackingTracker: (attackedPiece: Piece) => this.trackAttack(attackedPiece)
        }

        const newSquare = new Square(squareData);
        this.state.set(newSquare.chessPosition.notation, newSquare);

        this.addChild(newSquare);
        this.addChild(newSquare.hitbox);
      }
    }
  }

  buildNotations(player: Player) {
    const notationRowPos = new Point(this.startingPoint.x - (this.squareDimensions / 2), this.startingPoint.y + (this.squareDimensions / 3));
    const notationColumnPos = new Point(this.startingPoint.x + (this.squareDimensions / 2.5), this.startingPoint.y - (this.squareDimensions / 2));

    if (player === 'white') {
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
    } else {
      for (let i = 7; i >= 0; i--) {

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
  }

  placePieces(shape: GameShape, options: IGameOptions) {
    this.boardPieces = [];

    for (const pieceName in shape) {
      const position = shape[pieceName];

      const square: Square = this.state.get(position);

      const piece = this.setPiece(pieceName, square, options);
      this.boardPieces.push(piece);
      this.addChild(piece);

      square.orderDisplay();
    }
  }

  castle(rook: Piece): void {

    const row = rook.square.chessPosition.row;

    if (rook.square.chessPosition.column === 1) {
      const newPositionNotation = ChessPosition.getNotation(4, row);
      const newRookPosition: Square = this.state.get(newPositionNotation);

      rook.move(newRookPosition);

    } else if (rook.square.chessPosition.column === 8) {
      const newPositionNotation = ChessPosition.getNotation(6, row);
      const newRookPosition: Square = this.state.get(newPositionNotation);

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
      case 'blackPawn8': return new Pawn(pieceName, color, square, options);
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

    const piece = this.currentlySelectedSquare?.state;

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
    return this.state.get(position);
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

  setAvailableMoves(): void {
    for (const piece of this.boardPieces) {
      piece.setAvailableMoves(this.state);
    }
  }
}