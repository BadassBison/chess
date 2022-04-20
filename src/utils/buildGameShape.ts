import { GameShape } from '../board/shapes';
import { Square } from '../board/Square';
import { BoardShape } from '../models';

export const buildGameShape = (boardShape: BoardShape): GameShape => {
  const shape: Partial<GameShape> = {};

  boardShape.forEach((square: Square, notation: string) => {
    if (square.piece) {
      if (shape[square.piece.name]) { // Account for extra queens after promotion
        let count = 2;
        while (shape[`${square.piece.name}${count}`]) { count++ }
        shape[`${square.piece.name}${count}`] = notation;
      } else {
        shape[square.piece.name] = notation;
      }
    }
  });

  return shape as GameShape;
}