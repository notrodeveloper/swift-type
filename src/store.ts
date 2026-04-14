import { create } from "zustand";

interface State {
  config: {
    mode: "time" | "words" | "zen";
    showRealtimeStats: boolean;
    caseSensitive: boolean;
  };
  stats: {
    typos: number;
    wordCount: number;
    typedCharCount: number;
    secElapsed: number;
  };
}

interface Mutation {
  changeMode: (mode: State["config"]["mode"]) => void;
  toggleRealtimeStats: (bool?: boolean) => void;
  toggleCaseSensitive: (bool?: boolean) => void;
  incrStat: (stat: keyof State["stats"]) => void;
  reset: () => void;
}

interface Compute {
  calcWPM: (sec?: number, charCount?: number) => number;
  calcAccuracy: (typos?: number, charCount?: number) => number;
}

const initialState: State = {
  config: {
    mode: "time",
    showRealtimeStats: true,
    caseSensitive: false,
  },
  stats: {
    typos: 0,
    wordCount: 0,
    typedCharCount: 0,
    secElapsed: 0,
  },
};

const useStore = create<State & Mutation & Compute>()((set, get) => ({
  ...initialState,

  changeMode: (mode) =>
    set((state) => ({
      config: {
        ...state.config,
        mode,
        showRealtimeStats:
          mode === "zen" ? false : state.config.showRealtimeStats,
      },
    })),

  toggleRealtimeStats: (bool) =>
    set((state) => ({
      config: {
        ...state.config,
        showRealtimeStats:
          typeof bool === "boolean"
            ? bool
            : !state.config.showRealtimeStats,
      },
    })),

  toggleCaseSensitive: (bool) =>
    set((state) => ({
      config: {
        ...state.config,
        caseSensitive:
          typeof bool === "boolean"
            ? bool
            : !state.config.caseSensitive,
      },
    })),

  incrStat: (stat) =>
    set((state) => ({
      stats: {
        ...state.stats,
        [stat]: state.stats[stat] + 1,
      },
    })),

  reset: () =>
    set(() => ({
      stats: { ...initialState.stats },
    })),

  calcWPM: (
    sec = get().stats.secElapsed || 1,
    charCount = get().stats.typedCharCount
  ) => +(((charCount / 5) / (sec / 60)).toFixed(1)),

  calcAccuracy: (
    typos = get().stats.typos || 0,
    charCount = get().stats.typedCharCount
  ) =>
    charCount === 0
      ? 100
      : +(100 - (typos * 100) / charCount).toFixed(1),
}));

export default useStore;