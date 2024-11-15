import { create } from "zustand";
import { EncodingType } from "./types/EncodingType";

type EncodingStore = EncodingType & {
  setEncodings: (encoding: EncodingType) => void;
  resetEncodings: () => void;
};

export const useEncodingsStore = create<EncodingStore>()((set) => ({
  name: "",
  schoolId: "",
  encoding: "",

  setEncodings: (encoding:EncodingType) => {
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
