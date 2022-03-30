import { Container } from 'pixi.js';
import { Board } from './board/Board';

export class Game extends Container {
  constructor() {
    super();
  }

  init() {
    console.log('initializing the game');

    const board = Board.build('frenchDefense');

    this.addChild(board);
  }
}