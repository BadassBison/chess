import { Point } from 'pixi.js';
import { GameDimensions } from '../models';

export const calculateDimensions = (): GameDimensions => {
  const maxDim = Math.min(innerWidth, innerHeight);
  const isHorizontalScreen = maxDim === innerHeight;
  const squareDimensions = maxDim / 8;

  let startingPoint: Point;
  if (isHorizontalScreen) {
    startingPoint = new Point((innerWidth - maxDim) / 2, 0);
  } else {
    startingPoint = new Point(0, 0);
  }

  return { isHorizontalScreen, squareDimensions, startingPoint }
}