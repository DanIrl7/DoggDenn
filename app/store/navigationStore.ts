import { create } from 'zustand';

type TimeoutHandle = ReturnType<typeof setTimeout>;

interface NavigationStore {
  isNavigating: boolean;
  startedAt: number | null;
  stopTimer: TimeoutHandle | null;
  start: () => void;
  stop: (options?: { minDurationMs?: number }) => void;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  isNavigating: false,
  startedAt: null,
  stopTimer: null,

  start: () => {
    const { stopTimer } = get();
    if (stopTimer) clearTimeout(stopTimer);

    set({
      isNavigating: true,
      startedAt: Date.now(),
      stopTimer: null,
    });
  },

  stop: ({ minDurationMs = 350 } = {}) => {
    const { startedAt, stopTimer } = get();
    if (stopTimer) clearTimeout(stopTimer);

    if (!startedAt) {
      set({ isNavigating: false, startedAt: null, stopTimer: null });
      return;
    }

    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, minDurationMs - elapsed);

    if (remaining === 0) {
      set({ isNavigating: false, startedAt: null, stopTimer: null });
      return;
    }

    const timer = setTimeout(() => {
      set({ isNavigating: false, startedAt: null, stopTimer: null });
    }, remaining);

    set({ stopTimer: timer });
  },
}));
