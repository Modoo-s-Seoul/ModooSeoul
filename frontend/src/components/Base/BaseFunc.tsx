export function handleFullScreen() {
  // const isFullscreen = () => {
  //   return !!document.fullscreenElement;
  // };
  const requestFullscreen = () => {
    document.documentElement.requestFullscreen();
  };
  // const exitFullscreen = () => {
  //   document.exitFullscreen();
  // };

  requestFullscreen();
}
