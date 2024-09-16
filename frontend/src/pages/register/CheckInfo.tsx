import React from "react";
import { UserFormData } from "./InputInfo"; // Import UserFormData type

interface CheckInfoProps {
  formData: UserFormData; // Expect formData of type UserFormData
}

const CheckInfo: React.FC<CheckInfoProps> = ({ formData }) => {
  return (
    <>
    <div className="text-center mt-4">
        <h1 className="text-tc font-poppins">Check Information</h1>
    </div>
  
    <div className="w-full flex flex-col px-10 mt-8">
      
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
    <div className="flex justify-center w-full">
      <button className="bg-btnBg hover:btnHover font-poppins text-background rounded-lg w-3/5 py-2 mt-16 shadow-md">
      Submit
      </button>
    </div>
    </>
  );
};

export default CheckInfo;
