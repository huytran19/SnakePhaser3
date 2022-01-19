import Phaser from 'phaser';

import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 768,
  height: 576,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [BootScene, MenuScene, GameScene],
  backgroundColor: '#000000',
};

export default new Phaser.Game(config);
