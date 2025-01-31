export const generateRandomCellValue = () =>
  Math.floor(Math.random() * 900) + 100;

export const calculatePercentile50 = (column: number[]) => {
  column.sort((a, b) => a - b);
  const mid = Math.floor(column.length / 2);
  if (column.length % 2 === 0) {
    return (column[mid - 1] + column[mid]) / 2;
  } else {
    return column[mid];
  }
};
