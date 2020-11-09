import GlobalVariables from './GlobalVariables';
import IVariables from './IVariables';

class Canvases extends GlobalVariables {
  barWidth: number;
  barHeight: number;
  origin: {
    x: number;
    y: number;
  };

  constructor(params: IVariables) {
    super(params);
    this.barWidth = super.defaultWidthHeight().barWidth;
    this.barHeight = super.defaultWidthHeight().barHeight;
    this.origin = super.otherValues().origin;
  }

  defaultCanvas() {
    // create canvas for default wave
    const defaultWaveCanvas = document.createElement('canvas');
    const defaultWaveCtx = defaultWaveCanvas.getContext('2d')! as CanvasRenderingContext2D;
    defaultWaveCanvas.width = this.barWidth;
    defaultWaveCanvas.height = this.barHeight;
    defaultWaveCtx.fillStyle = 'transparent';
    defaultWaveCtx.fillRect(0, 0, this.barWidth, this.barHeight);
    defaultWaveCtx.translate(this.origin.x, this.origin.y); // move the 'y' coordinates up

    return {
      defaultWaveCanvas,
      defaultWaveCtx,
    };
  }

  animationCanvas() {
    // create canvas for animated wave
    const animateWaveCanvas = document.createElement('canvas');
    const animateWaveCtx = animateWaveCanvas.getContext('2d')! as CanvasRenderingContext2D;
    // animateWaveCanvas.id = "animate_wave_canvas";
    animateWaveCanvas.width = this.barWidth;
    animateWaveCanvas.height = this.barHeight;
    animateWaveCanvas.style.position = 'absolute';
    animateWaveCanvas.style.left = '0px';
    // create rectangle for animated wave
    animateWaveCtx.fillStyle = 'transparent'; // background color of animated wave rectangle
    animateWaveCtx.fillRect(0, 0, this.barWidth, this.barHeight); // size of animated wave rectangle
    animateWaveCtx.translate(this.origin.x, this.origin.y); // move the 'y' coordinates up

    return {
      animateWaveCanvas,
      animateWaveCtx,
    };
  }

  rewindCanvas() {
    // create canvas for seek(rewind) duration in wave
    const seekWaveCanvas = document.createElement('canvas');
    const seekWaveCtx = seekWaveCanvas.getContext('2d')! as CanvasRenderingContext2D;
    // seekWaveCanvas.id = "seekWaveCtx";
    seekWaveCanvas.width = this.barWidth;
    seekWaveCanvas.height = this.barHeight;
    seekWaveCanvas.style.position = 'absolute';
    seekWaveCanvas.style.left = '0px';
    // create rectangle for seek(rewind) wave
    seekWaveCtx.fillStyle = 'transparent'; // background color of seek(rewind) wave rectangle
    seekWaveCtx.fillRect(0, 0, this.barWidth, this.barHeight); // size of seek(rewind) wave rectangle
    seekWaveCtx.translate(this.origin.x, this.origin.y); // move the 'y' coordinates up

    return {
      seekWaveCanvas,
      seekWaveCtx,
    };
  }
}

export default Canvases;
