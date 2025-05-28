const getProgressColor = (percentage: number): string => {
  if (percentage <= 25) return '#ff5722';
  else if (percentage <= 50) return '#ff9800';
  else if (percentage <= 75) return '#ffc107';
  else if (percentage < 100) return '#8bc34a';
  else return '#4caf50';
};


export { getProgressColor };