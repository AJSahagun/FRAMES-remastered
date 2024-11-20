// import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRegistrationStore } from './stores/useRegistrationStore';
import { usePaginationStore } from './stores/usePaginationStore';
import { useImageStore } from './stores/useImgStore';
import { UserService } from '../../services/user.service';
import { UserRegistrationData } from '../../types/user.types';
import { departmentOptions, programOptions } from '../../types/deptandprog.types';

interface CheckInfoProps {
  formData: UserRegistrationData;
}

const CheckInfo: React.FC<CheckInfoProps> = () => {
  const { formData, resetForm } = useRegistrationStore();
  const { prevPage } = usePaginationStore();
  const { imageUrl } = useImageStore();
  
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const clearLocalStorage = () => {
    localStorage.removeItem('formData');
  };

  // TODO: something is wrong with the form data, it's not being passed to the handleSubmit function
  const handleSubmit = async (formData: UserRegistrationData) => {
    console.log('Form submitted');
    try {
      const response = await UserService.registerUser(formData);
      console.log('Form submitted:', formData);
      console.log('Registration successful:', response);
      toast.success('Your information has been submitted successfully.');
      resetForm();
      clearLocalStorage();
      if (!localStorage.getItem('formData')) {
        console.log('Form data cleared from localStorage');
      } else {
        console.error('Failed to clear form data from localStorage');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('An error occurred while submitting your information.');
    }
  };

  const handleConfirmSubmit = () => {
    console.log("handleConfirmSubmit called with formData:", formData);
  
    const userCodeFormat = /^2\d-\d{5}$/;
  
    // Check all required fields, including conditional ones for userCode format
    const isValid = Object.entries(formData).every(([key, value]) => {
      if (key === 'suffix' || key === 'imageUrl') return true; // 'suffix' can be empty
  
      // 'department' and 'program' are required if userCode matches the format
      if ((key === 'department' || key === 'program') && userCodeFormat.test(formData.userCode)) {
        return value != null && value !== '';
      }
  
      // Check other fields to ensure they're not empty or undefined
      return value != null && value !== '';
    });
  
    if (isValid) {
      handleSubmit(formData); // Triggers toast.success if successful
    } else {
      toast.error('Please fill in all fields before submitting.');
    }
  };
  
  

  const filteredFormData = Object.entries(formData).filter(
    ([key]) => (key !== 'encoding' && key !== 'imageUrl') ,
  );

  const departmentLabelMap = departmentOptions.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {} as Record<string, string>);
  
  const programLabelMap = Object.values(programOptions).flat().reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="w-full relative justify-center items-center">
      <div className="text-center">
      <h1 className="text-tc font-poppins md:text-5xl lg:mt-2">Confirmation</h1>
      </div>
      <ToastContainer position="top-center"/>

      <div className="flex items-center justify-center border-2 shadow-md border-tc rounded-2xl mt-8 h-40 w-2/5 mx-auto">
      {imageUrl ? (
        <img src={imageUrl} alt="Captured" />
      ) : (
        <p>No image captured.</p>
      )}
      </div>

      <div className="space-y-3 flex flex-col justify-center items-center w-full lg:space-y-4">
        {(filteredFormData).map(([key, value]) => (
          key=='imageUrl'? null :(
            value !== '' && (
              <div key={key} className="flex flex-col mt-4 mx-12 w-4/5 lg:flex-row lg:w-full lg:mt-7">
                <span className="font-semibold text-tc w-full">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span className="w-full px-6 py-2 rounded-lg bg-sf">
                  {key === 'department' ? departmentLabelMap[value] : key === 'program' ? programLabelMap[value] : typeof value === 'string' ? (value as string).toUpperCase() : value}
                </span>
              </div>
            )
            // <div key={key} className="flex flex-col mt-4 mx-12 w-4/5 lg:flex-row lg:w-full lg:mt-7">

            //   <span className="font-semibold text-tc w-full">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            //   {value !== '' && (
            //     <span className="w-full px-6 py-2 rounded-lg bg-sf">
            //       {key === 'department' ? departmentLabelMap[value] : key === 'program' ? programLabelMap[value] : typeof value === 'string' ? (value as string).toUpperCase() : value}
            //     </span>
            //   )}
            // </div>
          )
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevPage}
          className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
        >
          Back
        </button>
        <button
          // onClick={() => setShowConfirmDialog(true)}
          onClick={handleConfirmSubmit}
          className="bg-btnBg font-poppins text-background rounded-lg w-5/12 py-2 shadow-md transition-all duration-500 ease-in-out hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
        >
          Submit
        </button>
      </div>

      {/* {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-card bg-opacity-50">
          <div className="bg-white px-8 py-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-tc">Are you sure all the information you provided are correct?</h3>
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
      )} */}
    </div>
  );
};

export default CheckInfo;