import Phaser from 'phaser';
import { CONST } from '~/consts/const';
import Snake from '~/objects/snake';
import Apple from '~/objects/apple';

export default class GameScene extends Phaser.Scene {
  private gameHeight!: number;
  private gameWidth!: number;
  private boardWidth!: number;
  private boardHeight!: number;
  private horizontalFields!: number;
  private verticalFields!: number;
  private tick!: number;

  // objects
  private player!: Snake;
  private apple!: Apple;
  private gameBorder!: Phaser.GameObjects.Graphics[];

  // texts
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super('game-scene');
  }

  init(): void {
    this.gameHeight = this.sys.canvas.height;
    this.gameWidth = this.sys.canvas.width;
    this.boardWidth = this.gameWidth - 2 * CONST.FIELD_SIZE;
    this.boardHeight = this.gameHeight - 2 * CONST.FIELD_SIZE;
    this.horizontalFields = this.boardWidth / CONST.FIELD_SIZE;
    this.verticalFields = this.boardHeight / CONST.FIELD_SIZE;
    this.tick = 0;
  }

  create(): void {
    const bg = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      'space'
    );
    // objects
    this.gameBorder = [];
    let i = 0;
    for (let x = 0; x < this.gameWidth / CONST.FIELD_SIZE; x++) {
      for (let y = 0; y < this.gameHeight / CONST.FIELD_SIZE; y++) {
        if (
          y === 0 ||
          y === this.gameHeight / CONST.FIELD_SIZE - 1 ||
          x === 0 ||
          x === this.gameWidth / CONST.FIELD_SIZE - 1
        ) {
          this.gameBorder[i] = this.add
            .graphics({
              x: -CONST.FIELD_SIZE + x * CONST.FIELD_SIZE,
              y: -CONST.FIELD_SIZE + y * CONST.FIELD_SIZE,
              fillStyle: { color: 0x61e85b, alpha: 0.3 },
            })
            .fillRect(
              CONST.FIELD_SIZE,
              CONST.FIELD_SIZE,
              CONST.FIELD_SIZE,
              CONST.FIELD_SIZE
            );
          i++;
        }
      }
    }

    this.player = new Snake(this);
    this.apple = new Apple({
      scene: this,
      options: {
        x: this.rndXPos(),
        y: this.rndYPos(),
      },
    });

    // text
    this.scoreText = this.add.text(this.gameWidth / 2, 1, '' + CONST.SCORE);
  }

  update(time: number): void {
    if (this.tick === 0) {
      this.tick = time;
    }
    if (!this.player.isDead()) {
      if (time - this.tick > 100) {
        this.player.move();
        this.checkCollision();
        this.tick = time;
      }
      this.player.handleInput();
    } else {
      this.scene.start('menu-scene');
    }
  }

  private checkCollision(): void {
    const { x: headX, y: headY } = this.player.getHead();
    const square = new Phaser.Geom.Circle(
      headX * 1.5,
      headY * 1.5,
      headX * 0.6
    );
    // player vs. apple collision
    if (headX === this.apple.x && headY === this.apple.y) {
      this.player.growSnake();

      this.events.emit('blink', {
        x: this.apple.x,
        y: this.apple.y,
        square,
      });
      CONST.SCORE++;
      this.scoreText.setText('' + CONST.SCORE);
      this.apple.newApplePosition(this.rndXPos(), this.rndYPos());
    }

    // border vs. snake collision
    for (const { x, y } of this.gameBorder) {
      if (headX === x && headY === y) {
        this.player.setDead(true);
      }
    }

    // snake vs. snake collision
    this.player.checkSnakeSnakeCollision();
  }

  private rndXPos(): number {
    return (
      Phaser.Math.RND.between(1, this.horizontalFields - 1) * CONST.FIELD_SIZE
    );
  }

  private rndYPos(): number {
    return (
      Phaser.Math.RND.between(1, this.verticalFields - 1) * CONST.FIELD_SIZE
    );
  }
}
