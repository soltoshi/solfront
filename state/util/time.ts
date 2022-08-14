
const getCurrentTime = () => {
  var seconds = new Date().getTime() / 1000;
  return Math.round(seconds);
};

export {
  getCurrentTime,
}
