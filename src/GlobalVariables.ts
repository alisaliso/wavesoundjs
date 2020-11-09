import IVariables from './IVariables';
import Rectangle from './rectangleClass';
import parseWidthData from './parser/parseWidthData';
import parseData from './parser/parseData';

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
    const containerStyles = window.getComputedStyle(this.params.container);
    const barWidth = parseInt(containerStyles.getPropertyValue('width'), 10);
    const barHeight = parseInt(containerStyles.getPropertyValue('height'), 10);

    return {
      barWidth,
      barHeight,
    };
  }

  otherValues() {
    const spaceBetween = this.params.spaceBetween ? this.params.spaceBetween : this.defaultValues.spaceBetween;
    const cellWidth = this.params.cellWidth ? this.params.cellWidth : this.defaultValues.cellWidth;
    const peacksInCurrentBarWidth = Math.round(this.defaultWidthHeight().barWidth / (spaceBetween + cellWidth));
    const positiveNumbers = this.params.points
      ? parseWidthData(parseData(this.params.points).negativeNumbersArray, peacksInCurrentBarWidth)
      : [];
    const negativeNumbers = this.params.points
      ? parseWidthData(parseData(this.params.points).positiveNumbersArray, peacksInCurrentBarWidth)
      : [];
    const origin = { x: 0, y: this.defaultWidthHeight().barHeight / 1.7 }; // how much shift to top the 'y' position of canvas

    return {
      spaceBetween,
      cellWidth,
      positiveNumbers,
      negativeNumbers,
      origin,
    };
  }

  colorValues() {
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

    return {
      topDefaultWaveColor,
      bottomDefaultWaveColor,
      topAnimatedWaveColor,
      bottomAnimatedWaveColor,
    };
  }
}

export default GlobalVariables;
