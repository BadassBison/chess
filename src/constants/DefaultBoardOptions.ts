import { IBoardOptions } from '../models';
import { colors } from './colors';

export const DefaultBoardOptions: IBoardOptions = {
  player: 'white',
  startingShape: 'newGame',
  selectedEmptySquareColor: colors.lightBlue,
  moveableSpaceColor: colors.red,
  selectedPieceColor: colors.cyan,
  attackerPieceColor: colors.blue,
  lightSquareColor: colors.orange,
  darkSquareColor: colors.brown
}