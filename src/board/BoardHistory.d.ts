import { Container, Text } from 'pixi.js';
import { GameShape } from './shapes';
import { BoardUpdater, HistoryData, HistoryTrackerOptions, MoveTracker } from '../models';
import { Scrollbox } from 'pixi-scrollbox';
import { GlowFilter } from '@pixi/filter-glow';
export declare class BoardHistory extends Container {
    static nullMove: MoveTracker;
    gameShape: GameShape[];
    moves: MoveTracker[];
    scrollbox: Scrollbox;
    fontSize: number;
    lastCheckedRow: number;
    selectedRow: Text;
    glowFilter: GlowFilter;
    boardUpdater: BoardUpdater;
    constructor(parent: Container, gameShape: GameShape, boardUpdater: BoardUpdater, previousHistory?: HistoryData);
    initialState(gameShape: GameShape): void;
    initScrollbox(): void;
    trackHistory({ move, boardShape }: HistoryTrackerOptions): void;
    getHistory(): HistoryData;
    updateScrollbox(): void;
    createRow(rowIdx: number, move: MoveTracker): Text;
    clean(): void;
}
