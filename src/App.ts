import { Sprite, Application, IApplicationOptions, Texture } from 'pixi.js'

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

export const createApp = (): Application => {
  console.log('Initalizing the Application');

  const app = new Application(appOptions);
  document.body.appendChild(app.view);

  return app;
}

