declare module "@studio-freight/lenis" {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    wheelMultiplier?: number;
    prevent?: (node: HTMLElement) => boolean;
  }

  class Lenis {
    constructor(options?: LenisOptions);
    raf(time?: number): void;
    scrollTo(target: number, options?: { duration?: number }): void;
    destroy(): void;
  }

  export default Lenis;
}
