import { newGame } from './newGame';
import { ruyLopez } from './ruyLopez';
import { italianGame } from './italianGame';
import { sicilianDefense } from './sicilianDefense';
import { frenchDefense } from './frenchDefense';

export * from './GameShape';

export const shapeFactory = {
  newGame: () => newGame,
  ruyLopez: () => ruyLopez,
  italianGame: () => italianGame,
  sicilianDefense: () => sicilianDefense,
  frenchDefense: () => frenchDefense
}

