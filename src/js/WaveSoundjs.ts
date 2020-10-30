'use strict';

import parseData from "./parser/parseData";
import parseWidthData from "./parser/parseWidthData";
import Rectangle from "./rectangleClass";

interface IVariables {
  container: HTMLDivElement,
  points: number[],
  defaultWaveColor: {
    top: string,
    bottom: string
  },
  animatedWaveColor: {
    top: string,
    bottom: string
  },
  spaceBetween: number,
  cellWidth: number,
}

class GlobalVariables {
  params: IVariables;
  isAudioPlaying: boolean;
  myAudioElement: HTMLAudioElement;
  animateBottomGrid: Rectangle[];
  animateTopGrid: Rectangle[];
  seekBottomGrid: Rectangle[];
  seekTopGrid: Rectangle[];
  hasActive: boolean;
  hasActiveTransfer: boolean;
  hasTransfered: boolean;
  x: number;
  number: number;
  loopRequest: number;
  index: number;
  cols: number;
  x1: number;
  defaultValues = {
    defaultWaveColor: {
      top: '#e7eaf6',
      bottom: '#a2a8d3',
    },
    animatedWaveColor: {
      top: '#38598b',
      bottom: '#113f67',
    },
    spaceBetween: 1,
    cellWidth: 2,
  };

  constructor(params: IVariables) {
    this.params = params;
    this.isAudioPlaying = false;
    this.myAudioElement = document.querySelector(`.${params.container.className} > .current_audio`) as HTMLAudioElement;

    this.animateBottomGrid = [];
    this.animateTopGrid = [];
    this.seekBottomGrid = [];
    this.seekTopGrid = [];
    this.cols = 0;

    this.hasActive = false;
    this.hasActiveTransfer = false;
    this.hasTransfered = false;
    this.x = 0;
    this.number = 0;
    this.loopRequest = 0;
    this.index = 0;
    this.x1 = 0; // speed of coloring rectangle on play
    this.defaultValues = {
      defaultWaveColor: {
        top: '#e7eaf6',
        bottom: '#a2a8d3',
      },
      animatedWaveColor: {
        top: '#38598b',
        bottom: '#113f67',
      },
      spaceBetween: 1,
      cellWidth: 2,
    };
  }

  defaultWidthHeight() {
    const containerStyles = window.getComputedStyle(this.params.container),
      barWidth = parseInt(containerStyles.getPropertyValue("width")),
      barHeight = parseInt(containerStyles.getPropertyValue("height"));

    return {
      barWidth,
      barHeight
    }
  }

  otherValues() {
    const spaceBetween = this.params.spaceBetween ? this.params.spaceBetween : this.defaultValues.spaceBetween,
      cellWidth = this.params.cellWidth ? this.params.cellWidth : this.defaultValues.cellWidth,
      peacksInCurrentBarWidth = Math.round(this.defaultWidthHeight().barWidth / (spaceBetween + cellWidth)),
      positiveNumbers = this.params.points
        ? parseWidthData(parseData(this.params.points).negativeNumbersArray, peacksInCurrentBarWidth)
        : [],
      negativeNumbers = this.params.points
        ? parseWidthData(parseData(this.params.points).positiveNumbersArray, peacksInCurrentBarWidth)
        : [],
      origin = { x: 0, y: this.defaultWidthHeight().barHeight / 1.7 }; // how much shift to top the 'y' position of canvas

    return {
      spaceBetween,
      cellWidth,
      positiveNumbers,
      negativeNumbers,
      origin
    }
  }

  colorValues() {
    const topDefaultWaveColor = this.params.defaultWaveColor
      ? this.params.defaultWaveColor.top
      : this.defaultValues.defaultWaveColor.top,

      bottomDefaultWaveColor = this.params.defaultWaveColor
        ? this.params.defaultWaveColor.bottom
        : this.defaultValues.defaultWaveColor.bottom,

      topAnimatedWaveColor = this.params.animatedWaveColor
        ? this.params.animatedWaveColor.top
        : this.defaultValues.animatedWaveColor.top,

      bottomAnimatedWaveColor = this.params.animatedWaveColor
        ? this.params.animatedWaveColor.bottom
        : this.defaultValues.animatedWaveColor.bottom;

    return {
      topDefaultWaveColor,
      bottomDefaultWaveColor,
      topAnimatedWaveColor,
      bottomAnimatedWaveColor
    }
  }
}

class Canvases extends GlobalVariables {
  barWidth: number;
  barHeight: number;
  origin: {
    x: number,
    y: number
  };

  constructor(params: IVariables) {
    super(params);
    this.barWidth = super.defaultWidthHeight().barWidth;
    this.barHeight = super.defaultWidthHeight().barHeight;
    this.origin = super.otherValues().origin;
  }

  defaultCanvas() {
    // create canvas for default wave
    const defaultWaveCanvas = document.createElement("canvas"),
      defaultWaveCtx = defaultWaveCanvas.getContext("2d")! as CanvasRenderingContext2D;
    defaultWaveCanvas.width = this.barWidth;
    defaultWaveCanvas.height = this.barHeight;
    defaultWaveCtx.fillStyle = "transparent";
    defaultWaveCtx.fillRect(0, 0, this.barWidth, this.barHeight);
    defaultWaveCtx.translate(this.origin.x, this.origin.y); // move the 'y' coordinates up

    return {
      defaultWaveCanvas,
      defaultWaveCtx
    }
  }

  animationCanvas() {
    // create canvas for animated wave
    const animateWaveCanvas = document.createElement("canvas"),
      animateWaveCtx = animateWaveCanvas.getContext("2d")! as CanvasRenderingContext2D;
    // animateWaveCanvas.id = "animate_wave_canvas";
    animateWaveCanvas.width = this.barWidth;
    animateWaveCanvas.height = this.barHeight;
    animateWaveCanvas.style.position = "absolute";
    animateWaveCanvas.style.left = "0px";
    // create rectangle for animated wave
    animateWaveCtx.fillStyle = "transparent"; // background color of animated wave rectangle
    animateWaveCtx.fillRect(0, 0, this.barWidth, this.barHeight); // size of animated wave rectangle
    animateWaveCtx.translate(this.origin.x, this.origin.y); // move the 'y' coordinates up

    return {
      animateWaveCanvas,
      animateWaveCtx
    }
  }

  rewindCanvas() {
    // create canvas for seek(rewind) duration in wave
    const seekWaveCanvas = document.createElement("canvas"),
      seekWaveCtx = seekWaveCanvas.getContext("2d")! as CanvasRenderingContext2D;
    // seekWaveCanvas.id = "seekWaveCtx";
    seekWaveCanvas.width = this.barWidth;
    seekWaveCanvas.height = this.barHeight;
    seekWaveCanvas.style.position = "absolute";
    seekWaveCanvas.style.left = "0px";
    // create rectangle for seek(rewind) wave
    seekWaveCtx.fillStyle = "transparent"; // background color of seek(rewind) wave rectangle
    seekWaveCtx.fillRect(0, 0, this.barWidth, this.barHeight); // size of seek(rewind) wave rectangle
    seekWaveCtx.translate(this.origin.x, this.origin.y); // move the 'y' coordinates up

    return {
      seekWaveCanvas,
      seekWaveCtx
    }
  }
}

export default class WaveSoundjs extends GlobalVariables {
  static create(params: IVariables) {
    const wavesoundjs = new WaveSoundjs(params);
    return wavesoundjs.init();
  }

  init() {
    const topDefaultWaveColor = this.params.defaultWaveColor
      ? this.params.defaultWaveColor.top
      : this.defaultValues.defaultWaveColor.top;

    const bottomDefaultWaveColor = this.params.defaultWaveColor
      ? this.params.defaultWaveColor.bottom
      : this.defaultValues.defaultWaveColor.bottom;

    const topAnimatedWaveColor = this.params.animatedWaveColor
      ? this.params.animatedWaveColor.top
      : this.defaultValues.animatedWaveColor.top;

    const bottomAnimatedWaveColor = this.params.animatedWaveColor
      ? this.params.animatedWaveColor.bottom
      : this.defaultValues.animatedWaveColor.bottom;

    const barWidth = this.defaultWidthHeight().barWidth;
    const barHeight = this.defaultWidthHeight().barHeight;
    const spaceBetween = this.params.spaceBetween ? this.params.spaceBetween : this.params.spaceBetween;
    const cellWidth = this.params.cellWidth ? this.params.cellWidth : this.defaultValues.cellWidth;
    const peacksInCurrentBarWidth = Math.round(barWidth / (spaceBetween + cellWidth));
    const positiveNumbers = this.params.points
      ? parseWidthData(parseData(this.params.points).negativeNumbersArray, peacksInCurrentBarWidth)
      : [];

    const negativeNumbers = this.params.points
      ? parseWidthData(parseData(this.params.points).positiveNumbersArray, peacksInCurrentBarWidth)
      : [];

    const canvases = new Canvases(this.params);
    const defaultWaveCanvas = canvases.defaultCanvas().defaultWaveCanvas;
    const defaultWaveCtx = defaultWaveCanvas.getContext("2d");

    const animateWaveCanvas = canvases.animationCanvas().animateWaveCanvas;
    const animateWaveCtx = animateWaveCanvas.getContext("2d");

    const seekWaveCanvas = canvases.rewindCanvas().seekWaveCanvas;
    const seekWaveCtx = seekWaveCanvas.getContext("2d");

    // Populate grid
    let defaultGridXCoordinates: number[], // array with rectangles 'x' coordinates
      bottomPoints = negativeNumbers, // array with height bottom rectangles
      topPoints = positiveNumbers, // array with height top rectangles
      audioDur: number,
      speed: number;

    this.cols = positiveNumbers.length; // number of rectangles

    if (this.params.points && this.myAudioElement && this.params.container) {
      this.myAudioElement.addEventListener('loadedmetadata', () => {
        audioDur = this.myAudioElement.duration; // set duration on loaded audio
        // variable speed for change animation rectangles
        speed = this.cols / audioDur / 60;
        this.x1 = speed;
      }, false);

      defaultGridXCoordinates = this.createCanvasGridWithRectangles(defaultWaveCtx, cellWidth, spaceBetween, bottomPoints, topPoints, bottomDefaultWaveColor, topDefaultWaveColor);

      // click bar on animate canvas
      animateWaveCanvas.addEventListener("click", (e: MouseEvent) => {
        this.myAudioElement.addEventListener("playing", () => {
          this.playAudioEventHandler(animateWaveCtx, this.params.cellWidth, spaceBetween, bottomPoints, topPoints, bottomAnimatedWaveColor, topAnimatedWaveColor);
        });
        this.clickedBar(e, animateWaveCtx, seekWaveCtx, barWidth, barHeight, audioDur, defaultGridXCoordinates, this.params.cellWidth, spaceBetween, bottomAnimatedWaveColor, topAnimatedWaveColor, bottomPoints, topPoints);
        this.myAudioElement.addEventListener("playing", () => {
          this.playAudioEventHandler(animateWaveCtx, this.params.cellWidth, spaceBetween, bottomPoints, topPoints, bottomAnimatedWaveColor, topAnimatedWaveColor);
        }, true);
      }, false);

      this.myAudioElement.addEventListener("pause", this.pauseAudioEventHandler);
      this.myAudioElement.addEventListener("ended", () => {
        this.endedAudioEventHandler(animateWaveCtx, seekWaveCtx, barWidth, barHeight)
      });
      this.myAudioElement.addEventListener("canplaythrough", () => {
        this.playAudioEventHandler(animateWaveCtx, cellWidth, spaceBetween, bottomPoints, topPoints, bottomAnimatedWaveColor, topAnimatedWaveColor);
      });
    } else {
      console.error('No audio, points or container was passed into WaveSoundjs');
    }

    this.params.container.appendChild(defaultWaveCanvas);
    this.params.container.appendChild(seekWaveCanvas);
    this.params.container.appendChild(animateWaveCanvas);
  }

  // clear animate and seek(rewind) canvas rectangles
  clearReactangles = (animateWaveCtx: CanvasRenderingContext2D, seekWaveCtx: CanvasRenderingContext2D, barWidth: number, barHeight: number) => {
    animateWaveCtx.clearRect(0, 0, barWidth, barHeight);
    animateWaveCtx.clearRect(0, 0, barWidth, -barHeight);
    seekWaveCtx.clearRect(0, 0, barWidth, barHeight);
    seekWaveCtx.clearRect(0, 0, barWidth, -barHeight);
  }

  // start draw each rectangle
  triggerRectangles = (array1: Rectangle[], array2: Rectangle[]) => {
    // trigger cells
    if (!this.myAudioElement.paused && !this.myAudioElement.ended && this.index < this.cols) {
      array1[this.index].trigger();
      array2[this.index].trigger();
    }
  }

  // draw seeking(rewinding) rectangles on click on wave
  drawTransferedRectangles = () => {
    this.hasActive = false;
    this.hasActiveTransfer = false;
    this.hasTransfered = false;
    this.seekCurrentDuration(this.seekBottomGrid, this.seekTopGrid);
  }

  // draw animated rectangles on play
  updateRectangles = (array1: Rectangle[], array2: Rectangle[]) => {
    for (let i = 0; i < array1.length; i++) {
      array1[i].alpha = 0;
      array1[i].update();
      if (!array1[i].done) this.hasActive = true;

      array2[i].alpha = 0;
      array2[i].update();
      if (!array2[i].done) this.hasActive = true;
    }
  }

  // animate number of rectangles on seek(rewind) event on click bar event
  seekCurrentDuration = (array1: Rectangle[], array2: Rectangle[]) => {
    for (let i = 0; i < this.number; i++) {
      array1[i].alpha = 1;
      array1[i].transfer();
      if (!array1[i].done_transfer) this.hasActiveTransfer = true;

      array2[i].alpha = 1;
      array2[i].transfer();
      if (!array2[i].done_transfer) this.hasActiveTransfer = true;
    }

    // if (i === this.number) {
    //   // if all number of rectangles was drawn stop it
    //   this.hasTransfered = true;
    // }
  }

  // draw animateing rectangles wthen click on play
  drawAnimatedRectanglesOnPlay = () => {
    // trigger cells
    const gx = this.x | 0;
    if (gx >= 0 && gx < this.cols) {
      this.index = gx + this.number;
      this.triggerRectangles(this.animateBottomGrid, this.animateTopGrid);
    }
    this.x += this.x1;

    this.hasActive = false;
    this.hasActiveTransfer = false;
    this.hasTransfered = false;

    this.updateRectangles(this.animateBottomGrid, this.animateTopGrid);
  }

  // loop function for draw seek(rewind) and animated rectangles
  loop = () => {
    this.drawAnimatedRectanglesOnPlay();
    this.loopRequest = requestAnimationFrame(this.loop); // loop request
  }

  // count closest 'x' position of rectangle in canvas
  countClosestPositionToClickedPlaceInWave = (mouse_x: number, defaultGridXCoordinates: number[]) => {
    let new_position = 0;
    const closest = defaultGridXCoordinates.reduce((prev, curr) => {
      return Math.abs(curr - mouse_x) < Math.abs(prev - mouse_x) ? curr : prev;
    });

    for (let i = 0; i < defaultGridXCoordinates.length; ++i) {
      if (defaultGridXCoordinates[i] !== closest) {
        new_position++;
      } else {
        return new_position;
      }
    }

    return 0;
  }

  playAudioEventHandler = (animateWaveCtx: CanvasRenderingContext2D, cellWidth: number, spaceBetween: number, bottomPoints: number[], topPoints: number[], bottomAnimatedWaveColor: string, topAnimatedWaveColor: string) => {
    this.isAudioPlaying = true;

    cancelAnimationFrame(this.loopRequest);
    this.loopRequest = requestAnimationFrame(this.loop); // loop request

    const anumatedGrids = this.createNewGridsWithRectangle(animateWaveCtx, cellWidth, spaceBetween, bottomPoints, topPoints, bottomAnimatedWaveColor, topAnimatedWaveColor); // set rectangles in array for animating
    this.animateBottomGrid = anumatedGrids.bottomGrid;
    this.animateTopGrid = anumatedGrids.topGrid;
  }

  pauseAudioEventHandler = () => {
    this.isAudioPlaying = false;
    cancelAnimationFrame(this.loopRequest); // cancel loop animation
  }

  endedAudioEventHandler = (animateWaveCtx: CanvasRenderingContext2D, seekWaveCtx: CanvasRenderingContext2D, barWidth: number, barHeight: number) => {
    this.isAudioPlaying = false;
    this.pauseAudioEventHandler();
    this.resetGridAnimation(animateWaveCtx, seekWaveCtx, barWidth, barHeight);
  }

  // fill arrays with rectangle position
  createNewGridsWithRectangle = (ctx: CanvasRenderingContext2D, cellWidth: number, spaceBetween: number, bottomPoints: number[], topPoints: number[], bottomDefaultWaveColor: string, topDefaultWaveColor: string) => {

    const bottomGrid = [];
    const topGrid = [];

    for (let x = 0; x < this.cols; x++) {
      const x_coordinates_with_space_between =
        x * cellWidth + x * spaceBetween;
      bottomGrid.push(
        new Rectangle(
          ctx,
          x_coordinates_with_space_between,
          0,
          cellWidth,
          Math.round(bottomPoints[x]),
          bottomDefaultWaveColor,
          0.1
        )
      );
      topGrid.push(
        new Rectangle(
          ctx,
          x_coordinates_with_space_between,
          0,
          cellWidth,
          Math.round(topPoints[x]),
          topDefaultWaveColor,
          0.1
        )
      );
    }

    return { bottomGrid, topGrid };
  }

  // set default wave on load page
  createCanvasGridWithRectangles = (defaultWaveCtx: CanvasRenderingContext2D, cellWidth: number, spaceBetween: number, bottomPoints: number[], topPoints: number[], bottomDefaultWaveColor: string, topDefaultWaveColor: string) => {

    const newGrid: { bottomGrid: Rectangle[], topGrid: Rectangle[] } = this.createNewGridsWithRectangle(defaultWaveCtx, cellWidth, spaceBetween, bottomPoints, topPoints, bottomDefaultWaveColor, topDefaultWaveColor);

    const defaultGridXCoordinates: number[] = [];

    for (let i = 0; i < newGrid.bottomGrid.length; i++) {
      defaultGridXCoordinates.push(newGrid.bottomGrid[i].x);

      defaultWaveCtx.fillStyle = bottomDefaultWaveColor; // color for bottom rectangles
      defaultWaveCtx.fillRect(
        newGrid.bottomGrid[i].x,
        newGrid.bottomGrid[i].y,
        newGrid.bottomGrid[i].width,
        newGrid.bottomGrid[i].height
      );

      defaultWaveCtx.fillStyle = topDefaultWaveColor; // color for top rectangles
      defaultWaveCtx.fillRect(
        newGrid.topGrid[i].x,
        newGrid.topGrid[i].y,
        newGrid.topGrid[i].width,
        newGrid.topGrid[i].height
      );
    }

    return defaultGridXCoordinates;
  }

  resetGridAnimation = (animateWaveCtx: CanvasRenderingContext2D, seekWaveCtx: CanvasRenderingContext2D, barWidth: number, barHeight: number) => {
    this.animateBottomGrid = [] // array with bottom rectangles
    this.animateTopGrid = [] // array with top rectangles
    this.seekBottomGrid = [] // array with bottom rectangles for seeking(rewinding)
    this.seekTopGrid = [] // array with top rectangles for seeking(rewinding)
    this.hasActive = false // it's true when rectangle opacity is 1 on play
    this.hasActiveTransfer = false // it's true when rectangle opacity is 1 on seek(rewind)
    this.hasTransfered = false // variabel in order to call a function seekCurrentDuration only if true. True when seeking(rewinding) ended.
    this.x = 0 // speed for change animation rectangles
    this.number = 0 // number of rectangles for seek(rewind) manipulating

    cancelAnimationFrame(this.loopRequest); // cancel loop animation
    this.clearReactangles(animateWaveCtx, seekWaveCtx, barWidth, barHeight); // clear rectangels
  }

  // function calling when clicking on canvas
  clickedBar = (e: MouseEvent, animateWaveCtx: CanvasRenderingContext2D, seekWaveCtx: CanvasRenderingContext2D, barWidth: number, barHeight: number, audioDur: number, defaultGridXCoordinates: number[], cellWidth: number, spaceBetween: number, bottomAnimatedWaveColor: string, topAnimatedWaveColor: string, bottomPoints: number[], topPoints: number[]) => {
    // if audio currently is playing we need to pause audio for similar work in different browsers
    // because in Safari audio playing event doesn't pause audio on changing currentTime of this audio
    if (this.isAudioPlaying) {
      this.myAudioElement.pause();
    }

    this.resetGridAnimation(animateWaveCtx, seekWaveCtx, barWidth, barHeight);
    // update audio current time
    const mouseX = e.offsetX;
    const newTime = ((mouseX * audioDur) / barWidth).toFixed(3);
    this.myAudioElement.currentTime = parseInt(newTime);

    // and after a pause the audio, if audio was playing and not ended or paused we continue to play audio.
    if (this.isAudioPlaying) {
      this.myAudioElement.play();
    }

    this.number = this.countClosestPositionToClickedPlaceInWave(mouseX, defaultGridXCoordinates); // set quantity of rectangles

    const seekGrids = this.createNewGridsWithRectangle(seekWaveCtx, cellWidth, spaceBetween,
      bottomPoints, topPoints, bottomAnimatedWaveColor, topAnimatedWaveColor);
    this.seekBottomGrid = seekGrids.bottomGrid;
    this.seekTopGrid = seekGrids.topGrid;

    if (!this.myAudioElement.paused && !this.myAudioElement.ended) {
      const anumatedGrids = this.createNewGridsWithRectangle(animateWaveCtx, cellWidth, spaceBetween, bottomPoints, topPoints, bottomAnimatedWaveColor, topAnimatedWaveColor);
      this.animateBottomGrid = anumatedGrids.bottomGrid;
      this.animateTopGrid = anumatedGrids.topGrid;
    }

    this.drawTransferedRectangles();
  }
}
