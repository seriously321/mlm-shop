export const playSound = () => {
  if (typeof window !== 'undefined') {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.2;
    audio.play();
  }
};