import { CONST } from '~/consts/const';

export default class Snake {
  private dotSize: number;
  private snakeLength: number;
  private direction: string;
  private cursors: any;
  private dead: boolean;
  private snakeBody: Phaser.GameObjects.Graphics[];
  private scene: Phaser.Scene;

  public isDead(): boolean {
    return this.dead;
  }
  public setDead(_dead: boolean): void {
    this.dead = _dead;
  }
  public getSnakeBody(): Phaser.GameObjects.Graphics[] {
    return this.snakeBody;
  }
  public getHead(): Phaser.GameObjects.Graphics {
    return this.snakeBody[0];
  }
  public getSnakeLength(): number {
    return this.snakeLength;
  }

  constructor(scene: Phaser.Scene) {
    // set variables
    this.scene = scene;
    this.dotSize = CONST.FIELD_SIZE;
    this.snakeLength = 0;
    this.direction = 'right';
    this.dead = false;
    this.snakeBody = [];

    // input
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // build snake
    this.buildSnake();
    this.initParticle();
  }

  private buildSnake(): void {
    let currentAlpha = 0;
    for (let i = 0; i <= this.snakeLength; i++) {
      if (i === 0) {
        currentAlpha = 1;
      } else {
        currentAlpha = 0.8;
      }

      this.snakeBody[i] = this.scene.add
        .graphics({
          x: 48 - i * this.dotSize,
          y: 48,
          fillStyle: { color: 0x61e85b, alpha: currentAlpha },
        })
        .fillRect(this.dotSize, this.dotSize, this.dotSize, this.dotSize);
    }
  }

  public move(): void {
    // move body
    for (let i = this.snakeLength; i > 0; i--) {
      this.snakeBody[i].x = this.snakeBody[i - 1].x;
      this.snakeBody[i].y = this.snakeBody[i - 1].y;
    }

    // move head
    if (this.direction === 'left') {
      this.snakeBody[0].x -= this.dotSize;
    } else if (this.direction === 'right') {
      this.snakeBody[0].x += this.dotSize;
    } else if (this.direction === 'up') {
      this.snakeBody[0].y -= this.dotSize;
    } else if (this.direction === 'down') {
      this.snakeBody[0].y += this.dotSize;
    }
  }

  public handleInput(): void {
    if (this.cursors.up.isDown && this.direction != 'down') {
      this.direction = 'up';
    } else if (this.cursors.down.isDown && this.direction != 'up') {
      this.direction = 'down';
    } else if (this.cursors.right.isDown && this.direction != 'left') {
      this.direction = 'right';
    } else if (this.cursors.left.isDown && this.direction != 'right') {
      this.direction = 'left';
    }
  }

  public growSnake(): void {
    this.snakeLength++;
    this.snakeBody[this.snakeBody.length] = this.scene.add
      .graphics({
        x: this.snakeBody[this.snakeBody.length - 1].x,
        y: this.snakeBody[this.snakeBody.length - 1].y,
        fillStyle: { color: 0x61e85b, alpha: 0.8 },
      })
      .fillRect(this.dotSize, this.dotSize, this.dotSize, this.dotSize);
  }

  public checkSnakeSnakeCollision(): void {
    for (let i = this.snakeLength; i > 0; i--) {
      if (
        this.snakeLength > 1 &&
        this.snakeBody[0].x === this.snakeBody[i].x &&
        this.snakeBody[0].y === this.snakeBody[i].y
      ) {
        this.dead = true;
      }
    }
  }

  public initParticle(): void {
    const particles = this.scene.add.particles('flare');
    this.scene.events.on('blink', (data) => {
      const emitter = particles.createEmitter({
        x: data.x + 36,
        y: data.y + 36,
        lifespan: 300,
        speed: 10,
        quantity: 1,
        scale: { start: 0, end: 0.05, ease: 'Quad.easeOut' },
        alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
        blendMode: 'ADD',
      });
      this.scene.tweens.addCounter({
        duration: 250,
        onComplete: () => {
          emitter.stop();

          this.scene.time.delayedCall(1000, () => {
            particles.removeEmitter(emitter);
          });
        },
      });
    });
  }
}
