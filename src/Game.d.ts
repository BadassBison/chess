import { Container } from 'pixi.js';
import { Board } from './board/Board';
import { GameShapeName, Player } from './models';
export declare class Game extends Container {
    player: Player;
    boards: Board[];
    shownBoardIdx: number;
    startingGameShapeName: GameShapeName;
    constructor();
    init(): void;
    /**
     * Duplicates the last board
     */
    addBoard(): void;
    addButtonToMoveToNextBoardOrCreateNewBoard(): void;
    addButtonToMoveBackABoard(): void;
    addButtonToFlipBoard(): void;
}
