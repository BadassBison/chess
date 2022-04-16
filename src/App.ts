import { Application, IApplicationOptions } from 'pixi.js'
import { Game } from './Game';
import { DefaultGameOptions } from './DefaultGameOptions';
import { IGameOptions } from './models';

// Application.registerPlugin(AppLoaderPlugin);

// IApplicationOptions extends IRendererOptionsAuto, GlobalMixins.IApplicationOptions

// --- IRendererOptions ---
// width?: number;
// height?: number;
// view?: HTMLCanvasElement;
// useContextAlpha?: boolean | 'notMultiplied';
// /**
//  * Use `backgroundAlpha` instead.
//  * @deprecated
//  */
// transparent?: boolean;
// autoDensity?: boolean;
// antialias?: boolean;
// resolution?: number;
// preserveDrawingBuffer?: boolean;
// clearBeforeRender?: boolean;
// backgroundColor?: number;
// backgroundAlpha?: number;
// powerPreference?: WebGLPowerPreference;
// context?: IRenderingContext;

// --- IRendererOptionsAuto extends IRendererOptions ---
// forceCanvas?: boolean;

const appOptions: IApplicationOptions = {
  width: innerWidth,
  height: innerHeight,
  backgroundColor: 0xcccccc
}

export const createApp = (GameOptions: IGameOptions = DefaultGameOptions): void => {
  const app = new Application(appOptions);
  document.body.appendChild(app.view);

  const game = new Game(GameOptions);
  game.init();

  app.stage.addChild(game);
}

