declare module 'play-sound' {
  interface PlayerOptions {
    players?: string[];
    player?: string;
  }

  interface Player {
    play(file: string, options?: any, callback?: (err: any) => void): void;
  }

  function PlaySound(options?: PlayerOptions): Player;

  export = PlaySound;
}
