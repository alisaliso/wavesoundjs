// This function for separation data to positive
// and negative numbers
// for height of reactangles/points.
// Negative numbers for top rectengles.
// Positive numbers for bottom rectangles.
// param = [ 1, 0, 2, -5, 5, -7, ...] // array

// parse data

function parseData(data: number[]) {
  let negativeNumbersArray = [];
  let positiveNumbersArray = [];
  for (let i = 0; i < data.length; i++) {
    if ((i + 2) % 2 == 0) {
      // 30 is canvas height / 2
      // height / 2 because part of points go to top and another part go to bottom
      // it's needed for top and bottom points fit in canvas height
      if (data[i] < -30) {
        negativeNumbersArray.push(Math.round(-30));
      } else if (data[i] == 0) {
        // -1 is for line between top and bottom
        negativeNumbersArray.push(Math.round(-1));
      } else {
        negativeNumbersArray.push(Math.round(data[i]));
      }
    } else {
      if (data[i] > 30) {
        positiveNumbersArray.push(Math.round(20));
      } else if (data[i] == 0) {
        // 1 is for line between top and bottom
        positiveNumbersArray.push(Math.round(1));
      } else {
        positiveNumbersArray.push(Math.round(data[i]));
      }
    }
  }

  return { negativeNumbersArray, positiveNumbersArray }
}

export default parseData;
