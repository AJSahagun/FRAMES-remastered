import { create } from 'zustand'

interface ImageState {
  imageUrl: string | null
  setImageUrl: (url: string | null) => void
  resetImage: () => void
}

export const useImageStore = create<ImageState>((set) => ({
  imageUrl: null,
  setImageUrl: (url) => set({ imageUrl: url }),
  resetImage: () => set({ imageUrl: null })
}))