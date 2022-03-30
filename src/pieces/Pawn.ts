import { Sprite } from 'pixi.js';
import { Square } from '../board/Square';
import { Position } from '../utils/position';
import { Piece } from './Piece';

export class Pawn extends Piece {

  constructor(color: 'white' | 'black', square: Square, cb: Function) {
    super(square, cb);
    this.name = `${color}-pawn`;
    this.color = color;

    const sprite = Sprite.from(`img/${this.name}.svg`);
    sprite.scale.set(2);
    this.addChild(sprite);
    this.setNewSquare(square);
  }

  getMoves(): Position[] {
    // TODO: calculate moves

    return []
  }
}