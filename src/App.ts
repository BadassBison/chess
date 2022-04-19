import { Application, IApplicationOptions } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Game } from './Game';

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
export const createApp = (): void => {
  const app = new Application(appOptions);
  document.body.appendChild(app.view);

  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    interaction: app.renderer.plugins.interaction
  });

  app.stage.addChild(viewport);

  viewport
    .drag()
    .pinch()
    .wheel({
      wheelZoom: true,
      smooth: 25,
      percent: 1,
    })
    .decelerate();

  const game = new Game();
  game.init();

  app.stage.addChild(game);
}

