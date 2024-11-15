import { create } from "zustand";

type EncodingStore = any & {
  setEncodings: (encoding: any) => void;
  resetEncodings: () => void;
};

export const useEncodingsStore = create<EncodingStore>()((set) => ({
  name: "",
  schoolId: "",
  encoding: "",

  setEncodings: (encoding:any) => {
    set({
      name: encoding.name,
      schoolId: encoding.schoolId,
      encoding: encoding.encoding,
    });
  },
  resetEncodings: () => {
    set({
      name: "",
      schoolId: "",
      encoding: "",
    });
  },
  // inc: () => set((state) => ({ count: state.count + 1 })),
}));
