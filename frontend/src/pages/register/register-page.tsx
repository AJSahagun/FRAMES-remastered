import { useState } from "react";
import Pagination from "../../components/Pagination";
import InputInfo, { UserFormData } from "./InputInfo"; 
import RegisterFace from "./RegisterFace";
import CheckInfo from "./CheckInfo"; // Ensure CheckInfo is imported correctly

export default function Register() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<UserFormData | null>(null);

  const nextPage = () => {
    if (currentPage < 3) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFormValidation = (isValid: boolean, data?: UserFormData) => {
    setIsFormValid(isValid);
    if (data) {
      setFormData(data); // Store formData here
      localStorage.setItem("formData", JSON.stringify(data)); // Cache formData in localStorage
      console.log("Cached formData:", JSON.stringify(data)); // Log it to the console
    }
  };

  return (
    <div className="relative w-full h-screen justify-center items-center bg-background">
      <div className="flex w-full mt-16 justify-center">
        <img src="/logos/FRAMES_title-logo.png" alt="" className="w-11/12 ml-2" />
      </div>

      <div className="mb-4">
        <Pagination currentPage={currentPage} />
      </div>

      <div className="text-center mt-4">
        <h1 className="text-tc font-poppins">Registration</h1>
      </div>

      <div className="flex justify-center items-center">
        {currentPage === 1 && (
          <div className="flex flex-col w-full justify-center items-center">
            <InputInfo onValidate={handleFormValidation} />
            <button
              className={`font-poppins text-background rounded-lg w-3/5 py-2 mt-16 shadow-md ${
                isFormValid ? "bg-btnBg hover:btnHover" : "bg-btnBg opacity-50 "
              }`}
              onClick={nextPage}
              disabled={!isFormValid}
            >
              Next
            </button>
          </div>
        )}

        {currentPage === 2 && (
          <div>
            <RegisterFace />
            <div className="flex justify-between mt-4">
              <button className="btn" onClick={prevPage}>Back</button>
              <button className="btn" onClick={nextPage}>Next</button>
            </div>
          </div>
        )}

        {currentPage === 3 && (
          <div>
            {formData && <CheckInfo formData={formData} />} {/* Ensure CheckInfo receives formData */}
            <button className="btn mt-4" onClick={prevPage}>Back</button>
          </div>
        )}
      </div>
      <div className="font-poppins text-accent text-sm opacity-40 flex justify-center items-center mt-14 mb-6">
        Foster Wheeler - Alangilan
      </div>
    </div>
  );
}
