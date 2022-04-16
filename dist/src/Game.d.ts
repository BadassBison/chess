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
    addMoveBoardHandling(gameShape: GameShape): void;
    trackHistory({ move, boardShape }: HistoryTrackerOptions): void;
    boardUpdater(shape: GameShape): void;
}
