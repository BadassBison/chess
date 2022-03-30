import { newGameShape } from './newGameShape';

export * from './GameShape';

export const shapeFactory = {
  newGame: () => newGameShape
}

