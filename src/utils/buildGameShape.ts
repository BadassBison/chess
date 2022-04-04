import { GameShape } from '../board/shapes';
import { Square } from '../board/Square';
import { BoardShape } from '../models';

export const buildGameShape = (boardShape: BoardShape): GameShape => {
  const shape: Partial<GameShape> = {};

  boardShape.forEach((square: Square, notation: string) => {
    if (square.state) {
      shape[square.state.name] = notation;
    }
  });

  return shape as GameShape;
}