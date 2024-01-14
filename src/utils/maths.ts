export const roundNumber = (num: number) => Math.round(num * 100) / 100;

export const inRange = (val: number, min: number, max: number) => {
  return val >= min && val <= max;
};

export const getTrendline = (data: number[]) => {
  return data.map((_, index) => {
    const previousValues = data.slice(0, index + 1);
    const sum = previousValues.reduce((acc, value) => acc + value, 0);
    return sum / previousValues.length;
  });
};
