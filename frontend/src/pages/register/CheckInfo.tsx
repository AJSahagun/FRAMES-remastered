import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useRegistrationStore } from './stores/useRegistrationStore';
import { usePaginationStore } from './stores/usePaginationStore';
import { useImageStore } from './stores/useImgStore';
import { UserService } from '../../services/user.service';
import { UserRegistrationData } from '../../types/user.types';

interface CheckInfoProps {
  formData: UserRegistrationData;
}

const CheckInfo: React.FC<CheckInfoProps> = () => {
  const { formData, resetForm } = useRegistrationStore();
  const { prevPage } = usePaginationStore();
  const { imageUrl } = useImageStore();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = async (formData: UserRegistrationData) => {
    try {
      const response = await UserService.registerUser(formData);
      console.log('Form submitted:', formData);
      console.log('Registration successful:', response);
      setShowSuccessAlert(true);
      resetForm();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleConfirmSubmit = () => {
    const isValid = Object.entries(formData).every(([key, value]) => key === 'suffix' || key === 'middleName' || value !== '');
    if (isValid) {
      handleSubmit(formData);
    } else {
      setShowErrorAlert(true);
    }
    setShowConfirmDialog(false);
  };

  const filteredFormData = Object.entries(formData).filter(
    ([key]) => key !== 'encoding',
  );

  return (
    <div className="w-full relative justify-center items-center">
      <div className="text-center">
        <h1 className="text-tc font-poppins">Confirmation</h1>
      </div>

      <div className="flex items-center justify-center border-2 shadow-md border-tc rounded-2xl mt-8 h-40 w-2/5 mx-auto">
      {imageUrl ? (
        <img src={imageUrl} alt="Captured" />
      ) : (
        <p>No image captured.</p>
      )}
      </div>

      <div className="space-y-3 flex flex-col justify-center items-center w-full lg:space-y-4">
        {(filteredFormData).map(([key, value]) => (
          key=='imageUrl'? null:(
            <div key={key} className="flex flex-col mt-4 mx-12 w-4/5 lg:flex-row lg:w-full lg:mt-7">
              <span className="font-semibold text-tc w-full">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="w-full px-6 py-2 rounded-lg bg-sf">{typeof value === 'string' ? (value as string).toUpperCase() : value}</span>
            </div>
          )
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevPage}
          className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300 "
          >
          Back  
          </button>
        <button
          onClick={() => setShowConfirmDialog(true)}
          className="bg-btnBg font-poppins text-background rounded-lg w-5/12 py-2 shadow-md transition-all duration-500 ease-in-out hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105 "
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