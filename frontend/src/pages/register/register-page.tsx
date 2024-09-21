// import React from "react";
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { usePaginationStore } from "./stores/usePaginationStore";
import Pagination from "../../components/Pagination";
import InputInfo from "./InputInfo";
import RegisterFace from "./RegisterFace";
import CheckInfo from "./CheckInfo";

export default function Register() {
  const { currentPage, nextPage, prevPage } = usePaginationStore();
  const { formData, localFormData, isFormValid, submitForm } = useRegistrationStore();
  

  const handleNextClick = () => {
    if (isFormValid) {
      submitForm();
      localStorage.setItem("formData", JSON.stringify(localFormData));
      console.log("Cached formData:", JSON.stringify(localFormData));
      nextPage();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between bg-background">
      <div className="flex flex-col items-center">
        <div className="w-11/12 mt-16 ml-3">
          <img src="/logos/FRAMES_title-logo.png" alt="FRAMES Logo" className="w-4/5 mx-auto" />
        </div>

        <div className="w-full mb-4">
          <Pagination />
        </div>

        <div className="w-full px-4 flex justify-center">
          {currentPage === 1 && (
            <div className="w-full max-w-md flex flex-col items-center">
              <InputInfo formData={formData} />
              <button
                className={`font-poppins text-background rounded-lg w-full max-w-xs py-2 mt-8 shadow-md transition-all ${
                  isFormValid
                    ? "bg-btnBg hover:bg-btnHover"
                    : "bg-btnBg opacity-50 cursor-not-allowed"
                }`}
                onClick={handleNextClick}
                disabled={!isFormValid}
              >
                Next
              </button>
            </div>
          )}

          {currentPage === 2 && (
            <div className="w-full max-w-md">
              <RegisterFace />
              <div className="flex justify-between mt-4">
                <button
                  className="border-2 border-tc hover:bg-btnHover font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors"
                  onClick={prevPage}
                >
                  Back
                </button>
                <button
                  className="bg-btnBg hover:bg-btnHover font-poppins text-background rounded-lg w-5/12 py-2 shadow-md transition-colors"
                  onClick={nextPage}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentPage === 3 && (
            <div className="w-full max-w-md">
              <CheckInfo formData={formData} />
              {/* <div className="mt-4">
                <button
                  className="border-2 border-tc hover:bg-btnHover font-poppins text-tc rounded-lg px-6 py-2 transition-colors"
                  onClick={prevPage}
                >
                  Back
                </button>
              </div> */}
            </div>
          )}
        </div>
      </div>

      <div className="font-poppins text-accent text-sm opacity-40 text-center py-6">
        Foster Wheeler - Alangilan
      </div>
    </div>
  );
}