import { useState } from 'react';
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { usePaginationStore } from "./stores/usePaginationStore";
import Pagination from "../../components/Pagination";
import InputInfo from "./InputInfo";
import RegisterFace from "./RegisterFace";
import CheckInfo from "./CheckInfo";
import FosterWeelerTag from '../../components/FosterWheelerTag';
import RegistrationGuide from "../../components/RegistrationGuide";

export default function Register() {
  const { currentPage, nextPage, prevPage } = usePaginationStore();
  const { formData, localFormData, isFormValid, submitForm } = useRegistrationStore();

  const [showGuide, setShowGuide] = useState(true);
  
  const handleGuideClose = () => {
    setShowGuide(false);
    // Placeholder if added logic for close
  };
  
  const handleGuideProceed = () => {
    setShowGuide(false);
    // Placeholder if added logic for proceed
  };
  

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
      <RegistrationGuide 
        isOpen={showGuide}
        onClose={handleGuideClose}
        onProceed={handleGuideProceed}
      />
      <FosterWeelerTag />

      <div className="flex flex-col items-center lg:items-start">

        <div className="sm:w-4/5 mt-16 ml-3
          min-[320px]:w-2/3 md:w-2/3 md:max-w-sm lg:relative lg:ml-24 lg:mt-12">
          <img src="/logos/FRAMES_title-logo.png" alt="FRAMES Logo" className="w-4/5 mx-auto lg:ml-0 lg:w-3/5" />
        </div>

        <div className="w-full mb-4">
          <Pagination />
        </div>

        <div className="w-full px-10 flex justify-center lg:w-screen">
          {currentPage === 1 && (
            <div className="w-full max-w-md flex flex-col items-center justify-center">
              <InputInfo formData={formData} />
              <button
                className={`font-poppins text-md text-background rounded-lg w-2/3 py-2 mt-10 shadow-md transition-all duration-500  ease-in-out lg:mt-20
                   ${
                  isFormValid
                    ? "bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
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
              <RegisterFace formData={formData} />
              <div className="flex justify-between mt-4">
                <button
                  className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
                  onClick={prevPage}
                >
                  Back
                </button>
                <button
                  className={`w-5/12 py-2 font-poppins text-background rounded-lg shadow-md transition-all duration-500 ease-in-out
                   ${
                    localFormData.encoding.length > 0
                    ? "bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
                    : "bg-btnBg opacity-50 cursor-not-allowed"
                }`}
                onClick={handleNextClick}
                disabled={localFormData.encoding.length <= 0}
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