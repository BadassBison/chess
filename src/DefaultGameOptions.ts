import { IGameOptions } from './models';
import { colors } from './constants/colors';

export const DefaultGameOptions: IGameOptions = {
  player: 'white',
  startingShape: 'newGame',
  selectedEmptySquareColor: colors.lightBlue,
  moveableSpaceColor: colors.red,
  selectedPieceColor: colors.cyan,
  attackerPieceColor: colors.blue,
  lightSquareColor: colors.orange,
  darkSquareColor: colors.brown
}