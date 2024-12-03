import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRegistrationStore } from './stores/useRegistrationStore';
import { useRegisterPaginationStore } from './stores/useRegisterPaginationStore';
import { useImageStore } from './stores/useImgStore';
import { UserService } from '../../services/user.service';
import { UserRegistrationData } from '../../types/user.types';
import { departmentOptions, programOptions } from '../../types/deptandprog.types';
import TermsOfService from '../../components/TermsOfService';

interface CheckInfoProps {
  formData: UserRegistrationData;
}

const CheckInfo: React.FC<CheckInfoProps> = () => {
  const { formData, resetForm } = useRegistrationStore();
  const { prevPage } = useRegisterPaginationStore();
  const { imageUrl } = useImageStore();
  const navigate = useNavigate();
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  const clearLocalStorage = () => {
    localStorage.removeItem('formData');
  };

  const validateFormData = (formData: UserRegistrationData): boolean => {
    const userCodeFormat1 = /^\d{2}-\d{5}$/; // Format: 'dd-ddddd'
    const userCodeFormat2 = /^P-\d{5}$/;    // Format: 'P-ddddd'
  
    if (userCodeFormat1.test(formData.userCode)) {
      // For 'dd-ddddd' format, 'department' and 'program' must be non-empty
      if (!formData.department || !formData.program) return false;
    } else if (userCodeFormat2.test(formData.userCode)) {
      // For 'P-ddddd' format, 'department' and 'program' are optional
    } else {
      return false;
    }
  
    const requiredFields = ['firstName', 'middleName', 'lastName', 'userCode', 'encoding'];
    for (const field of requiredFields) {
      if (!formData[field as keyof UserRegistrationData]) return false;
    }
    return true; // All checks passed
  };  

  const handleSubmit = async (formData: UserRegistrationData) => {
    try {
      const response = await UserService.registerUser(formData);
  
      if (response.statusCode === 202) {
        console.log('Registration successful:', response.message);
        toast.success('Your information has been submitted successfully.');
  
        resetForm();
        clearLocalStorage();

        new Promise(resolve => setTimeout(resolve, 1000)).then(() => { navigate('/'); });
      } else {
        throw new Error('Unexpected response from backend');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('An error occurred while submitting your information.');
    }
  };

  const handleConfirmSubmit = () => {
    console.log("handleConfirmSubmit called with formData:", formData);
  
    if (validateFormData(formData)) {
      handleSubmit(formData);
    } else {
      toast.error('Please fill in all fields before submitting.');
    }
    setShowConfirmDialog(false);
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
  

  const handleAgree = () => {
    setHasAgreedToTerms(true);
    setIsTermsModalOpen(false);
  };
  
  const handleDisagree = () => {
    setHasAgreedToTerms(false);
    setIsTermsModalOpen(false);
  };
  
  return (
    <div className="w-full relative justify-center items-center">
      <div className="text-center">
      <h1 className="text-tc font-poppins md:text-5xl lg:mt-2">Confirmation</h1>
      </div>
      <ToastContainer position="top-center"/>

      <div className="flex items-center justify-center border-2 shadow-md border-tc rounded-lg mt-8 h-[138px] w-2/5 mx-auto">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Captured"
            className="w-full h-full object-cover rounded-md"  // This ensures the image fits the container
          />
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
          )
        ))}
      </div>

      <div className="flex justify-start mt-4 w-full">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            onClick={() => setIsTermsModalOpen(true)}
            checked={hasAgreedToTerms}
            onChange={(e) => setHasAgreedToTerms(e.target.checked)}
            className="h-4 w-4 border-2 border-tc rounded"
          />
          <span className="text-tc text-sm">
            I agree to the <a href="#" onClick={() => setIsTermsModalOpen(true)} className="text-blue-500 underline">
              Terms of Service
            </a>
          </span>
        </label>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevPage}
          className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setShowConfirmDialog(true)}
          className={`bg-btnBg font-poppins text-background rounded-lg w-5/12 py-2 shadow-md transition-all duration-500 ease-in-out hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105 ${!hasAgreedToTerms ? 'disabled opacity-50 cursor-not-allowed' : ''}`}
          disabled={!hasAgreedToTerms}
        >
          Submit
        </button>
      </div>

      {showConfirmDialog && (
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
      )}

      <TermsOfService 
        isOpen={isTermsModalOpen}
        onAgree={handleAgree}
        onDisagree={handleDisagree}
      />
    </div>

  );
};

export default CheckInfo;