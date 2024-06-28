// format values if greater than thousand
export const formatTicks = (value: any) => {
  const absValue = Math.abs(value);

  if (absValue >= 1000000) {
    let convertedValue = Math.trunc((value / 1000000) * 100) / 100;
    return `${convertedValue}M`;
  }
  if (absValue >= 1000) {
    let convertedValue = Math.trunc((value / 1000) * 100) / 100;
    return `${convertedValue}K`;
  }

  return value;
};
