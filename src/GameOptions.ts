import { IGameOptions } from './models';
import { colors } from './utils/colors';

export const GameOptions: IGameOptions = {
  player: 'white',
  startingShape: 'ruyLopez',
  selectedEmptySquareColor: colors.lightBlue,
  moveableSpaceColor: colors.red,
  selectedPieceColor: colors.cyan,
  attackerPieceColor: colors.blue,
  lightSquareColor: colors.orange,
  darkSquareColor: colors.brown
}