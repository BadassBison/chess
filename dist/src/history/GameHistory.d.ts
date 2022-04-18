import { Container, Text } from 'pixi.js';
import { GameShape } from '../board/shapes';
import { BoardUpdater, HistoryData, HistoryTrackerOptions, MoveTracker } from '../models';
export declare class GameHistory extends Container {
    static nullMove: MoveTracker;
    gameShape: GameShape[];
    moves: MoveTracker[];
    display: Container;
    fontSize: number;
    boardUpdater: BoardUpdater;
    constructor(boardUpdater: BoardUpdater);
    initialState(gameShape: GameShape): void;
    trackHistory({ move, boardShape }: HistoryTrackerOptions): void;
    getHistory(): HistoryData;
    updateDisplay(): void;
    createRow(rowContent: string, rowIdx: number): Text;
}
