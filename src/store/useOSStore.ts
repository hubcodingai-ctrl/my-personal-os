import { create } from 'zustand';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  url?: string;
}

interface OSStore {
  windows: WindowState[];
  activeWindowId: string | null;
  highestZIndex: number;
  openApp: (app: { id: string; title: string; url?: string }) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowBounds: (id: string, position: { x: number; y: number }, size: { width: number; height: number }) => void;
}

export const useOSStore = create<OSStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  highestZIndex: 10,

  openApp: (app) => {
    const { windows, highestZIndex } = get();
    const existingWindow = windows.find((w) => w.appId === app.id);

    if (existingWindow) {
      get().focusWindow(existingWindow.id);
      if (existingWindow.isMinimized) {
        set((state) => ({
          windows: state.windows.map((w) => (w.id === existingWindow.id ? { ...w, isMinimized: false } : w)),
        }));
      }
      return;
    }

    const newZIndex = highestZIndex + 1;
    const newWindow: WindowState = {
      id: `win-${Date.now()}`,
      appId: app.id,
      title: app.title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 80, y: 50 },
      size: { width: 900, height: 600 },
      zIndex: newZIndex,
      url: app.url,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      highestZIndex: newZIndex,
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)),
    }));
  },

  focusWindow: (id) => {
    const { highestZIndex } = get();
    const newZIndex = highestZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: newZIndex } : w)),
      activeWindowId: id,
      highestZIndex: newZIndex,
    }));
  },

  updateWindowBounds: (id, position, size) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position, size } : w)),
    }));
  },
}));
