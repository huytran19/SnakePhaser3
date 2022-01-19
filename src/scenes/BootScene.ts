import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('boot-scene');
  }
  preload() {
    this.load.image('flare', 'flash01.png');
    this.load.image('block', '50x50-black.png');
    this.load.image('logo', 'ship.png');
    this.load.image('space', 'space.jpg');
  }

  update() {
    this.scene.start('menu-scene');
  }
}
