import Phaser from 'phaser';
import { CONST } from '~/consts/const';
export default class MenuScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  private blocks!: Phaser.GameObjects.Group;
  private groupConfig!: Phaser.Types.GameObjects.Group.GroupCreateConfig;
  private text1!: Phaser.GameObjects.Text;
  private text2!: Phaser.GameObjects.Text;
  constructor() {
    super('menu-scene');
  }

  init() {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );

    if (CONST.SCORE > CONST.HIGHSCORE) {
      CONST.HIGHSCORE = CONST.SCORE;
    }
    CONST.SCORE = 0;
  }

  create() {
    const bg = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      'space'
    );

    this.groupConfig = { key: 'block', repeat: 191 };
    this.blocks = this.add.group(this.groupConfig);

    Phaser.Actions.GridAlign(this.blocks.getChildren(), {
      width: 16,
      cellWidth: 50,
      cellHeight: 50,
      x: 25,
      y: 25,
    });

    this.text1 = this.add
      .text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2 - 50,
        'SNAKE',
        { color: 'white', fontSize: '100px' }
      )
      .setOrigin(0.5, 0.5);
    this.text2 = this.add
      .text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height / 2 + 25,
        'Press S to play',
        { color: 'white', fontSize: '70px' }
      )
      .setOrigin(0.5, 0.5);
  }

  update(): void {
    if (this.startKey.isDown) {
      let i = 0;
      this.blocks.children.iterate((child) => {
        this.tweens.add({
          targets: child,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          y: '+=64',
          angle: 180,
          ease: 'Power3',
          duration: 1000,
          delay: 1000 + i * 100,
        });
        this.text1.setVisible(false);
        this.text2.setVisible(false);
        i++;

        if (i % 16 === 0) {
          i = 0;
        }
      });
      this.time.delayedCall(3000, () => {
        this.scene.start('game-scene');
      });
    }
  }
}
