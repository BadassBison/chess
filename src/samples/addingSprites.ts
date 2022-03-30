import { Container, Sprite, Texture } from 'pixi.js';

export const testObject = (): Container => {
  const testObject = new Sprite(Texture.WHITE);
  testObject.width = 200;
  testObject.height = 200;
  testObject.tint = 0xff00ff;
  testObject.alpha = 0.5;
  testObject.position.set(300, 300);

  return testObject;
}

export const testImg = (): Container => {
  let testObject = Sprite.from('img/sample.png');

  return testObject;
}