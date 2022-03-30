import { testObject } from './samples'
import { Container, InteractionEvent, Point } from 'pixi.js';
import { makeDraggable } from './utils/makeDraggable';
import { Board } from './board/Board';

export class Game extends Container {
  constructor() {
    super();
  }

  init() {
    console.log('initializing the game');

    const board = Board.build();

    this.addChild(board);
  }
}