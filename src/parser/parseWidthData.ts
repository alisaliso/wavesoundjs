function calculateValue(originData: number[], step: number, i: number) {
  const firstValueIndex = Math.round(i * step);
  const lastValueIndex = Math.round((i + 1) * step - 1);
  const range = lastValueIndex - firstValueIndex;

  if (range === 0) {
    return originData[lastValueIndex];
  } else {
    let sum = 0;

    for (let j = 0; j <= range; j++) {
      sum += originData[firstValueIndex + j];
    }

    return sum / (range + 1);
  }
}

function doubleData(originData: number[], targetValue: number) {
  const step = targetValue / originData.length;
  const array = [];

  for (const num of originData) {
    for (let i = 0; i < step; i++) {
      array.push(Math.ceil(num));
    }
  }

  return array;
}

function fullArrayWithCalculatedValues(originData: number[], targetValue: number) {
  let array = [];
  const step = originData.length / targetValue;

  if (originData.length > targetValue) {
    for (let i = 0; i < targetValue; i++) {
      const x = calculateValue(originData, step, i);

      array.push(Math.ceil(x));
    }
  } else {
    const doubledOriginData = originData.length === targetValue ? originData : doubleData(originData, targetValue);
    array = doubledOriginData;
  }

  return array;
}

function parseWidthData(array: number[], num: number) {
  return fullArrayWithCalculatedValues(array, num);
}

export default parseWidthData;
