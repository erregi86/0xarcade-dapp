import useSound from 'use-sound';

export const useAudio = () => {
  // Volume: 0.5 = 50%. Regola a piacere.
  const [playClick] = useSound('/sounds/click.wav', { volume: 0.5 });
  const [playSuccess] = useSound('/sounds/success.wav', { volume: 0.6 });
  const [playError] = useSound('/sounds/glitch.wav', { volume: 0.6 });

  // Wrapper per evitare crash se il file non viene caricato subito
  const safePlay = (playFn: () => void) => {
    if (playFn) {
      playFn();
    }
  };

  return {
    click: () => safePlay(playClick),
    success: () => safePlay(playSuccess),
    error: () => safePlay(playError),
  };
};