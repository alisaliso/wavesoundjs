// class for creating each rectangle for wave
export default class Rectangle {
  ctx: CanvasRenderingContext2D; // context for this instance
  x: number; // x position for this instance
  y: number; // y position for this instance
  width: number; // width for this instance
  height: number; // height for this instance
  color: string; // color for this instance
  speed: number; // increment for alpha per frame
  alpha: number; // current alpha for this instance
  triggered: boolean; // is running
  done: boolean; // has finished animate
  doneTransfer: boolean; // has finished transfer

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, speed: number) {
    this.ctx = ctx; // context for this instance
    this.x = x; // x position for this instance
    this.y = y; // y position for this instance
    this.width = w; // width for this instance
    this.height = h; // height for this instance
    this.color = color; // color for this instance
    this.speed = speed; // increment for alpha per frame
    this.alpha = 0; // current alpha for this instance
    this.triggered = false; // is running
    this.done = false; // has finished animate
    this.doneTransfer = false; // has finished transfer
  }

  update() {
    if (this.triggered && !this.done) {
      // only if active
      this.alpha += this.speed; // update alpha
      this.done = this.alpha >= 1; // update status
    }

    this.ctx.fillStyle = this.color; // render this instance
    this.ctx.globalAlpha = Math.min(1, this.alpha);
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  trigger() {
    this.triggered = true; // start this rectangle
  }

  transfer() {
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = Math.min(1, this.alpha);
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.doneTransfer = true;
  }
}
