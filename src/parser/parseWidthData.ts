function calculateValue(origin_data: number[], step: number, i: number) {
  const first_value_index = Math.round(i * step);
  const last_value_index = Math.round((i + 1) * step - 1);
  const range = last_value_index - first_value_index;

  if (range == 0) {
    return origin_data[last_value_index];
  } else {
    let sum = 0;

    for (let j = 0; j <= range; j++) {
      sum += origin_data[first_value_index + j];
    }

    return sum / (range + 1);
  }
}

function doubleData(origin_data: number[], target_value: number) {
  const step = target_value / origin_data.length;
  const array = [];

  for (const number of origin_data) {
    for (let i = 0; i < step; i++) {
      array.push(Math.ceil(number));
    }
  }

  return array;

}

function fullArrayWithCalculatedValues(origin_data: number[], target_value: number) {
  let array = [];
  const step = origin_data.length / target_value;

  if (origin_data.length > target_value) {

    for (let i = 0; i < target_value; i++) {
      const x = calculateValue(origin_data, step, i);

      array.push(Math.ceil(x));
    }
  } else {
    const doubledOriginData = origin_data.length === target_value ? origin_data : doubleData(origin_data, target_value);
    array = doubledOriginData;
  }

  return array;
}

function parseWidthData(array: number[], number: number) {
  return fullArrayWithCalculatedValues(array, number);
}

export default parseWidthData;
