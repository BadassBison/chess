
import { Game } from './Game';
import { createApp } from './App';

const app = createApp();

const game = new Game();
game.init();

app.stage.addChild(game);
