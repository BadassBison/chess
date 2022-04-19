import { Container, Point } from 'pixi.js';
import { Piece } from '../pieces';
import { GameShape } from './shapes';
import { Square } from './Square';
import { BoardShape, HistoryData, IBoardOptions } from '../models';
import { BoardHistory } from './BoardHistory';
export declare class Board extends Container {
    boardShape: BoardShape;
    boardPieces: Piece[];
    history: BoardHistory;
    currentlySelectedSquare: Square;
    squareDimensions: number;
    startingPoint: Point;
    boardOptions: IBoardOptions;
    constructor(gameShape: GameShape, options: IBoardOptions, boardNumber: number, history?: HistoryData);
    getGameShape(): GameShape;
    updateBoardFromHistory(gameShape: GameShape): void;
    /**
     * Switches the current board from white to black
     */
    flipBoard(): void;
    /**
     * Label that shows which board number this is
     *
     * @param boardNumber
     */
    private buildBoardLabel;
    /**
     * Builder which creates all squares for the board
     */
    private buildSquares;
    /**
     * Sets board pieces for the game shape
     * @param shape
     */
    private placePieces;
    /**
     *
     * @param pieceName
     * @param square
     * @param options
     * @returns Piece
     */
    private buildPiece;
    /**
     * When a pawn reaches the back row
     * @param pawn
     */
    private promotion;
    /**
     * When a king castles
     * @param rook
     */
    private castle;
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
    private handleSquareClick;
    private trackAttack;
    setAvailableMovesOnAllPieces(): void;
    setAttackingPiecesOnSquare(): void;
    private removeAttackingPiecesOnAllSquares;
    private calculateDimensions;
    clear(): void;
}
