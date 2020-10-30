import WaveSoundjs from './js/WaveSoundjs';

import points from './js/points';
const playerContainer = document.querySelector('.container');

// params
//  WaveSoundjs.create({
//    container: player_container, - html element
//    points, - array of numbers
//    spaceBetween - number
//    cellWidth - number
//    defaultWaveColor - color / object { top: color, bottom: color }
//    animatedWaveColor - color / object { top: color, bottom: color }
//   })

WaveSoundjs.create({
  container: playerContainer,
  points,
  spaceBetween: 1,
  cellWidth: 2,
  defaultWaveColor: {
    top: '#8685EF',
    bottom: '#8685EF'
  },
  animatedWaveColor: {
    top: '#474554',
    bottom: '#474554'
  }
});
