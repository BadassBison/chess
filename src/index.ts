
import { Game } from './Game';
import { createApp } from './App';
import './styles/main.css';
import { GameOptions } from './GameOptions';

// PIXI.js App
const app = createApp();

// TODO: Restart game with different options

const game = new Game(GameOptions);
game.init();

app.stage.addChild(game);
