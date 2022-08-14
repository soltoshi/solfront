
const getCurrentTime = () => {
  var seconds = new Date().getTime() / 1000;
  return Math.round(seconds);
};

const renderEpochSeconds = (t: number): string => {
  const date = new Date(t * 1000);
  return date.toLocaleString();
}

export {
  getCurrentTime,
  renderEpochSeconds,
}
