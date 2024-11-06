import { create } from 'zustand';

interface SliderState {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const useSliderStore = create<SliderState>((set) => ({
	activeIndex: 0,
	setActiveIndex: (index: number) => set(() => ({ activeIndex: index })),
}));
