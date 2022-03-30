import { DisplayObject, InteractionEvent, Point } from 'pixi.js';
import { onKeyPress } from './onKeyPress';

export async function makeDraggable(object: DisplayObject) {
  object.buttonMode = true;
  object.interactive = true;

  let isDragging = false;

  const lastPosition = new Point();
  const newPosition = new Point();

  object.on('mousedown', (e: InteractionEvent) => {
    isDragging = true;

    lastPosition.copyFrom(e.data.global);

  });

  object.on('mouseupoutside', () => {
    isDragging = false;
  });

  object.on('mouseup', (e: InteractionEvent) => {
    isDragging = false;
  });

  object.on('mousemove', (e: InteractionEvent) => {
    if (isDragging) {

      newPosition.copyFrom(e.data.global);
      object.x += newPosition.x - lastPosition.x;
      object.y += newPosition.y - lastPosition.y;
      lastPosition.copyFrom(e.data.global);

    }
  });

  const name = object.name || "object";
  onKeyPress(' ', () => {
    const x = Math.round(object.x);
    const y = Math.round(object.y);
    console.log(`${name}.position.set(${x}, ${y})`);
  });

  return object;
}