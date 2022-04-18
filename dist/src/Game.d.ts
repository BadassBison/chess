import { Container } from 'pixi.js';
import { Board } from './board/Board';
import { GameShape } from './board/shapes';
import { GameHistory } from './history/GameHistory';
import { GameShapeName, HistoryTrackerOptions, IGameOptions, Player } from './models';
export declare class Game extends Container {
    history: GameHistory;
    player: Player;
    boards: Board[];
    startingGameShapeName: GameShapeName;
    options: IGameOptions;
    constructor(options: IGameOptions);
    init(): void;
    addBoard(gameShape: GameShape): void;
    addButtonToCreateNewBoards(gameShape: GameShape): void;
    addButtonToFlipBoard(gameShape: GameShape): void;
    addMoveBoardHandling(): void;
    trackHistory({ move, boardShape }: HistoryTrackerOptions): void;
    boardUpdater(shape: GameShape): void;
}
