// import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRegistrationStore } from './stores/useRegistrationStore';
import { usePaginationStore } from './stores/usePaginationStore';
import { UserService } from '../../services/user.service';
import { UserRegistrationData } from '../../types/user.types';
import { departmentOptions, programOptions } from '../../types/deptandprog.types';
import { useImageStore } from './stores/useImgStore';

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false); // New state for terms checkbox
  const [showTermsModal, setShowTermsModal] = useState(false); // State to control the Terms of Service modal

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
    const isValid = Object.entries(formData).every(([key, value]) => key === 'suffix' || key === 'middleName' || value !== '');
    if (isValid && hasAgreedToTerms) { // Check if terms are agreed
      handleSubmit(formData);
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
        {filteredFormData.map(([key, value]) => (
          key === 'imageUrl' ? null : (
            <div key={key} className="flex flex-col mt-4 mx-12 w-4/5 lg:flex-row lg:w-full lg:mt-7">
              <span className="font-semibold text-tc w-full">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="w-full px-6 py-2 rounded-lg bg-sf">
                {typeof value === 'string' ? (value as string).toUpperCase() : value}
              </span>
            </div>
          )
        ))}
      </div>

      {/* Terms of Service checkbox */}
      <div className="flex justify-start mt-4 w-full">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasAgreedToTerms}
            onChange={(e) => setHasAgreedToTerms(e.target.checked)}
            className="h-4 w-4 border-2 border-tc rounded"
          />
          <span className="text-tc text-sm">
            I agree to the <a
              href="#"
              onClick={() => setShowTermsModal(true)} // Open the Terms modal
              className="text-blue-500 underline"
            >
              Terms of Service
            </a>
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevPage}
          className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
        >
          Back
        </button>
          className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
        >
          Back
        </button>
        <button
          // onClick={() => setShowConfirmDialog(true)}
          onClick={handleConfirmSubmit}
          className="bg-btnBg font-poppins text-background rounded-lg w-5/12 py-2 shadow-md transition-all duration-500 ease-in-out hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
          onClick={() => setShowConfirmDialog(true)}
          className="bg-btnBg font-poppins text-background rounded-lg w-5/12 py-2 shadow-md transition-all duration-500 ease-in-out hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
          disabled={!hasAgreedToTerms} // Disable submit if terms not agreed
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
            <p>Please fill in all fields and agree to the terms before submitting.</p>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 max-h-[80vh] font-poppins">
            <h2 className="flex justify-center text-xl font-bold text-tc mb-4">Terms of Service - FRAMES</h2>
            <p className="text-base text-justify text-sm leading-relaxed mt-4 mb-4">
              These Terms of Service <strong>(TOS)</strong> govern your registration process and participation in the Facial Recognition Access Monitoring Enhanced System <strong>"FRAMES"</strong> provided by <strong>Foster Wheeler Alangilan Library</strong>. By registering with FRAMES, you agree to the terms outlined in this agreement. If you do not agree to these Terms, do not complete the registration process.
            </p>

            <p className = "text-sm">Last Updated: <strong>November, 2024</strong></p>
            {/* Terms Content */}
            <div className = "font-poppins text-sm max-h-[50vh] overflow-auto mt-4">
              <h6><strong>1. Purpose of FRAMES Registration</strong></h6>
              <p className="text-base text-justify text-sm leading-relaxed mt-1 mb-3 mr-2 pl-3">
                The registration process is required to enable access to <strong>FRAMES</strong>, a facial recognition-based access monitoring system. During registration, you will be asked to provide personal information and capture a facial image for the purpose of creating a unique biometric profile for identity verification and access control within the system.
              </p>

              <h6><strong>2. Data Collection and Use</strong></h6>
              <p className="text-base text-justify text-sm leading-relaxed mt-1 mb-1 mr-2 pl-3">
                As part of the FRAMES registration process, we collect and use the following information:
              </p>
              <ul className = "pl-3">
                <li className="text-justify leading-relaxed mt-1 mb-1 mr-2"><strong>Personal Information</strong>: We may collect basic personal information, including but not limited to your full name, date of birth, email address, and contact details.</li>
                <li className="text-justify leading-relaxed mt-1 mb-1 mr-2"><strong>Biometric Data</strong>: To create a facial recognition profile, we will capture and process an image of your face using our facial recognition technology. This image, along with related biometric features (e.g., facial landmarks, geometry, distances), will be used exclusively for the purpose of identifying you within the FRAMES system.</li>
                <li className="text-justify leading-relaxed mt-1 mb-1 mr-2"><strong>Purpose of Data Collection</strong>: 
                  <ul className = "list-disc pl-5">
                    <li>To create your unique biometric profile.</li>
                    <li>To enable secure, efficient, and accurate identification when accessing authorized areas or systems through FRAMES.</li>
                    <li>For system maintenance and performance improvements.</li>
                  </ul>
                </li>
              </ul>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                By completing the registration, you acknowledge and consent to the collection and use of your personal and biometric data for these purposes.
              </p>

              <h6><strong>3. Consent</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                By proceeding with the registration and providing your facial image, you give explicit consent for us to process, store, and use your biometric data for identity verification purposes within the <strong>FRAMES</strong> system.
              </p>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                <strong>Voluntary Participation</strong>: Your participation in the FRAMES registration process is voluntary, but failure to complete registration may limit or prevent your ability to access systems or areas protected by FRAMES.
              </p>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                <strong>Right to Withdraw Consent</strong>: You have the right to withdraw your consent at any time. To do so, please contact our support team at [contact email/phone number]. If you withdraw consent, we will delete your biometric data from the FRAMES system, though this may impact your access to areas or services that rely on biometric verification.
              </p>

              <h6><strong>4. Data Retention</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                Your personal information and biometric data will be stored securely for as long as necessary to fulfill the purpose of the FRAMES system, including access verification. We will retain your biometric data for no longer than necessary and will securely delete it if you request account deletion or if your access rights are terminated.
              </p>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                <strong>Retention Period</strong>: We may retain your information for as long as your access to the FRAMES system remains active. If your access is revoked or terminated, we will retain your data for a maximum of [X months/years] before securely deleting it.
              </p>

              <h6><strong>5. Privacy and Security</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                We take privacy and security seriously. We use industry-standard encryption techniques and other security measures to protect your personal and biometric data during registration, storage, and transmission.
              </p>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                <strong>Data Protection</strong>: Your biometric data will be stored in a secure, encrypted format and will only be accessible to authorized personnel for the purpose of maintaining and operating the FRAMES system.
              </p>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                <strong>Data Access</strong>: Access to your personal and biometric data will be strictly controlled and limited to necessary personnel within the organization who are authorized to manage the system.
              </p>

              <h6><strong>6. Third-Party Access and Data Sharing</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                We do not sell, rent, or lease your biometric or personal data to third parties. However, we may share your data in the following circumstances:
              </p>
              <ul>
                <li className = "text-justify leading-relaxed mb-1 mr-2 pl-3"><strong>Service Providers</strong>: We may share data with third-party service providers who assist us in operating, maintaining, and improving the FRAMES system. These third parties are required to safeguard your data in accordance with applicable privacy laws.</li>
                <li className = "text-justify leading-relaxed mb-3 mr-2 pl-3"><strong>Legal Requirements</strong>: We may disclose your data if required to do so by law, in response to legal processes, or to protect our legal rights or the safety of others.</li>
              </ul>

              <h6><strong>7. User Responsibilities</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                By registering for FRAMES, you agree to:
              </p>
              <ul className = "pl-8 list-disc">
                <li>Provide accurate and complete information during the registration process.</li>
                <li>Ensure the facial image you provide is clear, well-lit, and accurately represents your face for identification purposes.</li>
                <li className = "mb-3">Notify us promptly if any of your registration details change, including contact information or access privileges.</li>
              </ul>

              <h6><strong>8. Accuracy of Biometric Data</strong></h6>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                While we strive to ensure the accuracy and security of our facial recognition technology, we cannot guarantee that the system will always function flawlessly. In case of errors or difficulties in your face recognition process, you may contact support for assistance, and we will take reasonable steps to resolve the issue.
              </p>

              <h6><strong>9. Account Termination and Deletion</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                If you choose to stop using the FRAMES system, you may request the deletion of your personal and biometric data. This will result in the removal of your face recognition profile from our system, which will effectively revoke your access to areas and systems protected by FRAMES.
              </p>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                <strong>How to Request Deletion</strong>: To request account deletion or the removal of your data, contact our support team at [contact email/phone number]. We will process your request within [X days].
              </p>

              <h6><strong>10. Changes to Terms</strong></h6>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                We may update or modify these Terms from time to time. If significant changes are made, you will be notified via email or within the system. By continuing to use FRAMES after such changes are made, you accept and agree to the updated Terms.
              </p>

              <h6><strong>11. Governing Law</strong></h6>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                These Terms shall be governed by and construed in accordance with the laws of [State/Country], without regard to its conflict of law principles.
              </p>

              <h6><strong>12. Contact Information</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2 pl-3">
                If you have any questions, concerns, or requests regarding the registration process or your personal data, please contact us at:
              </p>
              <p className = "text-justify leading-relaxed mb-3 mr-2 pl-3">
                <strong>Foster Wheeler Alangilan Library </strong><br />
                <strong>library.alangilan@g.batstate-u.edu.ph </strong><br />
                <strong>Batangas State University - TNEU, Main II Alangilan Campus</strong>
              </p>

              <h6><strong>Acknowledgment</strong></h6>
              <p className = "text-justify leading-relaxed mb-1 mr-2">
                By clicking <strong>"Agree"</strong> or proceeding with registration, you acknowledge that you have read, understood, and consent to these Terms of Service, including the collection and use of your personal and biometric data.
              </p>

              <div className="mt-4 mr-2 mb-2 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)} // Close the modal
                className="px-4 py-2 rounded-md shadow-md text-white bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
              >
                Close
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInfo;
