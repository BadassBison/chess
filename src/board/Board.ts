import { Container, Point, Text } from 'pixi.js';
import { King, Queen, Rook, Bishop, Knight, Pawn, Piece } from '../pieces';
import { GameShape } from './shapes';
import { Square } from './Square';
import { ChessPosition } from './ChessPosition';
import { BoardShape, HistoryData, IBoardOptions, MoveTracker, SquareData } from '../models';
import { BoardHistory } from './BoardHistory';
import { buildGameShape } from '../utils/buildGameShape';
import { calculateDimensions } from '../utils/calculateDimensions';

export class Board extends Container {
  boardShape: BoardShape;
  boardPieces: Piece[];
  history: BoardHistory;
  label: Text;
  currentlySelectedSquare: Square;
  squareDimensions: number;
  startingPoint: Point;
  boardOptions: IBoardOptions;

  constructor(gameShape: GameShape, options: IBoardOptions, boardNumber: number, history?: HistoryData) {
    super();

    this.boardShape = new Map<string, Square>();
    this.boardOptions = options;
    this.buildSquares();
    this.placePieces(gameShape);
    this.setAvailableMovesOnAllPieces();
    this.buildBoardLabel(boardNumber);
    this.history = new BoardHistory(this, gameShape, (gameShape: GameShape) => { this.updateBoardFromHistory(gameShape) }, history);
  }

  getGameShape(): GameShape {
    return buildGameShape(this.boardShape);
  }

  updateBoardFromHistory(gameShape: GameShape) {
    this.clear();
    this.placePieces(gameShape);
    this.setAvailableMovesOnAllPieces();
  }

  /**
   * Switches the current board from white to black
   */
  flipBoard() {
    const parent = this.parent;
    parent.removeChild(this);

    const gameShape = buildGameShape(this.boardShape);
    this.boardShape = new Map<string, Square>();
    this.boardOptions.player = this.boardOptions.player === 'white' ? 'black' : 'white';
    this.buildSquares();

    this.placePieces(gameShape);
    this.setAvailableMovesOnAllPieces();

    parent.addChild(this);
  }

  /**
   * Label that shows which board number this is
   *
   * @param boardNumber
   */
  private buildBoardLabel(boardNumber: number) {
    this.label = new Text(`BOARD ${boardNumber}`);
    this.label.position.set(0, this.height);
    this.addChild(this.label);
  }

  /**
   * Builder which creates all squares for the board
   */
  private buildSquares() {
    this.calculateDimensions();

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {

        const squareData: SquareData = {
          boardOptions: this.boardOptions,
          row,
          column,
          startingPoint: this.startingPoint,
          squareDimensions: this.squareDimensions,
          squareClickCB: (square: Square) => this.handleSquareClick(square),
          attackingTracker: (attackedPiece: Piece) => this.trackAttack(attackedPiece)
        }

        const newSquare = new Square(squareData);
        this.boardShape.set(newSquare.chessPosition.notation, newSquare);

        this.addChild(newSquare, newSquare.hitbox);
        if (newSquare.notations.length > 0) {
          for (const notation of newSquare.notations) {
            this.addChild(notation);
          }
        }
      }
    }
  }

  /**
   * Sets board pieces for the game shape
   * @param shape
   */
  private placePieces(shape: GameShape) {
    this.boardPieces = [];

    for (const pieceName in shape) {
      const position = shape[pieceName];

      const square: Square = this.boardShape.get(position);

      const piece = this.buildPiece(pieceName, square, this.boardOptions);
      this.boardPieces.push(piece);
      this.addChild(piece);

      square.orderDisplay();
    }
  }

  /**
   *
   * @param pieceName
   * @param square
   * @param options
   * @returns Piece
   */
  private buildPiece(pieceName: string, square: Square, options: IBoardOptions): Piece {
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
      case 'whiteQueen2':
      case 'whiteQueen3':
      case 'blackQueen':
      case 'blackQueen2':
      case 'blackQueen3': return new Queen(pieceName.substring(0, 10), color, square, options);
      case 'whiteKing':
      case 'blackKing': return new King(pieceName, color, square, options, (rook: Piece): void => { this.castle(rook) });
    }
  }

  /**
   * When a pawn reaches the back row
   * @param pawn
   */
  private promotion(pawn: Piece): void {
    const square = pawn.square;
    const pawnIdx = this.boardPieces.findIndex((piece: Piece) => piece === pawn);

    const queen = new Queen(`${pawn.color}Queen`, pawn.color, square, this.boardOptions);
    this.boardPieces[pawnIdx] = queen;

    this.removeChild(pawn);
    pawn.destroy();
    this.addChild(queen);

    square.orderDisplay();
  }

  /**
   * When a king castles
   * @param rook
   */
  private castle(rook: Piece): void {

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

  /**
   * Square click handling
   *
   * this should detect
   *  - new square clicked (moving)
   *  - new square clicked (selecting)
   *  - same square clicked (deselecting)
   *
   * @param newSelectedSquare
   */
  private handleSquareClick(newSelectedSquare: Square): void {
    const selectedSquare = this.currentlySelectedSquare !== newSelectedSquare;
    const deselectedSquare = this.currentlySelectedSquare === newSelectedSquare;

    const piece = this.currentlySelectedSquare?.piece;

    const hasPiece = !!piece;
    const isAvailableMove = hasPiece ? piece.availableMoves.includes(newSelectedSquare) : false;
    const isMove = selectedSquare && isAvailableMove;

    if (isMove) {
      this.history.clean();

      this.currentlySelectedSquare.removeAllHighlights();

      const oldPosition = piece.getPosition() as string;

      const attackedPiece = piece.move(newSelectedSquare);

      const move: MoveTracker = {
        pieceName: piece.name,
        oldPosition,
        newPosition: piece.getPosition() as string,
        ...(attackedPiece ? { attackedPiece: attackedPiece.name } : {})
      }

      this.history.trackHistory({ move, boardShape: this.boardShape });

      this.setAvailableMovesOnAllPieces();

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

  private trackAttack(attackedPiece: Piece): Piece {
    let piece: Piece;

    if (attackedPiece) {
      this.boardPieces = this.boardPieces.filter((p: Piece) => p !== attackedPiece);
      piece = attackedPiece;

      this.removeChild(attackedPiece);
      attackedPiece.destroy();
    }

    return piece;
  }

  // TODO: We need to split out attacking and available
  setAvailableMovesOnAllPieces(): void {
    this.removeAttackingPiecesOnAllSquares();

    for (const piece of this.boardPieces) {
      piece.setAvailableMoves(this.boardShape);
    }
  }

  setAttackingPiecesOnSquare() {
    // TODO: This needs to run before the available moves
  }

  private removeAttackingPiecesOnAllSquares(): void {
    for (const [notation, square] of this.boardShape) {
      square.attackingPieces = [];
    }
  }

  private calculateDimensions() {
    const { squareDimensions, startingPoint } = calculateDimensions();
    this.squareDimensions = squareDimensions;
    this.startingPoint = startingPoint;
  }

  clear(): void {
    for (const piece of this.boardPieces) {
      const square = piece.square;
      square.piece = null;
      this.removeChild(piece);
    }
  }
}