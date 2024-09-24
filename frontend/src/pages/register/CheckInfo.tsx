import React, { useState } from 'react';
import { useRegistrationStore } from './stores/useRegistrationStore';
import { usePaginationStore } from './stores/usePaginationStore';
import { registerUser } from '../../services/RegisterService';
interface UserFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  srCode: string;
  department: string;
  course: string;
}
interface CheckInfoProps {
  formData: UserFormData;
}

const CheckInfo: React.FC<CheckInfoProps> = () => {
  const { formData, resetForm } = useRegistrationStore();
  const { prevPage } = usePaginationStore();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    const data= {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      department: formData.department,
      program: formData.course,
      encoding:"sample"
      }
    console.log("testing")
    registerUser(data);
    setShowSuccessAlert(true);
    resetForm();
  };

  const handleConfirmSubmit = () => {
    const isValid = Object.entries(formData).every(([key, value]) => key === 'suffix' || value !== '');
    if (isValid) {
      handleSubmit();
    } else {
      setShowErrorAlert(true);
    }
    setShowConfirmDialog(false);
  };

  return (
    <div className="w-full relative justify-center items-center">
      <div className="text-center">
        <h1 className="text-tc font-poppins">Confirmation</h1>
      </div>

      <div className="flex items-center justify-center border-2 shadow-md border-tc rounded-2xl mt-8 h-40 w-2/5 mx-auto">
        placeholder card
      </div>

      <div className="">
      {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex flex-row mt-4 mx-12 w-4/5">
            <span className="font-semibold text-tc w-full">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <span className="w-full px-6 py-2 rounded-lg bg-sf">{value.toUpperCase()}</span>
          </div>
        ))}


      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevPage}
          className="border-2 border-tc hover:bg-btnHover font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors"
          >
          Back  
          </button>
        <button
          onClick={() => setShowConfirmDialog(true)}
          className="bg-btnBg hover:bg-btnHover font-poppins text-background rounded-lg w-5/12 py-2 shadow-md transition-colors"
        >
          Submit
        </button>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2 text-tc">Are you sure?</h3>
            <p className="mb-4 text-accent">Are you sure you entered all your information correctly?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 text-tc rounded hover:bg-gray-300 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-btnBg text-background rounded hover:bg-btnHover transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessAlert && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <p className="font-bold">Success</p>
            <p>Your information has been submitted successfully.</p>
          </div>
        </div>
      )}

      {showErrorAlert && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2v6m0-6V4m0 6h6m-6 0H4"></path>
          </svg>
          <div>
            <p className="font-bold">Error</p>
            <p>Please fill in all fields before submitting.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckInfo;