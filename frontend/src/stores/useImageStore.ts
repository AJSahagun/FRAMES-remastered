// stores/useImageStore.ts
import { create } from 'zustand';

interface ImageState {
  imagesLoaded: boolean;
  setImagesLoaded: (loaded: boolean) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  imagesLoaded: false,
  setImagesLoaded: (loaded) => set({ imagesLoaded: loaded }),
}));
