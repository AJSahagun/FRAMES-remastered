import { useState } from "react";
import Pagination from "../../components/Pagination";
import InputInfo from "./InputInfo";
import RegisterFace from "./RegisterFace"; // Import the RegisterFace component
import CheckInfo from "./CheckInfo"; // Import the CheckInfo component

export default function Register() { 
  // State to track the current page
  const [currentPage, setCurrentPage] = useState(1);

  // Function to move to the next page
  const nextPage = () => {
    if (currentPage < 3) setCurrentPage(currentPage + 1);
  };

  // Function to move to the previous page
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full h-screen justify-center bg-background">
      <div className="flex w-full justify-center mt-16">
        <img src="/logos/FRAMES_title-logo.png" alt="" 
        className="w-4/5"/>
      </div>

      <div className="text-center mt-4">
        <h1 className="text-tc font-poppins">Registration</h1>
      </div>

      <div className="mb-4">
        <Pagination currentPage={currentPage} />
      </div>

      {/* Conditionally render based on the currentPage state */}
      <div className="flex justify-center items-center">
        {currentPage === 1 && (
          <div>
            <InputInfo />
            <button
              className="btn mt-4"
              onClick={nextPage} // Move to the next page (RegisterFace)
            >
              Next
            </button>
          </div>
        )}

        {currentPage === 2 && (
          <div>
            <RegisterFace />
            <div className="flex justify-between mt-4">
              <button
                className="btn"
                onClick={prevPage} // Move back to the previous page (InputInfo)
              >
                Back
              </button>
              <button
                className="btn"
                onClick={nextPage} // Move to the next page (CheckInfo)
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentPage === 3 && (
          <div>
            <CheckInfo />
            <button
              className="btn mt-4"
              onClick={prevPage} // Move back to the previous page (RegisterFace)
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
