import { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the specific icon

export default function RegistrationGuide() {
    // State to keep track of the current step
    const [currentStep, setCurrentStep] = useState(0);

    // Steps array with titles, descriptions, and images
    const steps = [
        { title: "Step 1: Provide Your Information", content: "Enter your personal details.", image: "/images/register.jpg" },
        { title: "Step 2: Register Your Face", content: "Allow the system to capture your face." , image: "/images/facescan.jpg" },
        { title: "Step 3: Verify Your Registration", content: "Check if information in the fields are correct.", image: "/images/checking.jpg" },
        { title: "Step 4: Confirm", content: "After checking, confirm your registration.", image: "/images/confirmed.jpg" },
    ];

    // Function to handle next step
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Function to handle previous step
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Function to handle exit (return to the homepage)
    const handleExit = () => {
        // Redirect to the homepage
        window.location.href = '/'; 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full h-[520px] flex flex-col justify-between relative">
                
                {/* Exit Button */}
                <button
                    onClick={handleExit}
                    className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"
                    aria-label="Exit"
                >
                    <FaTimes className="text-gray-600 text-sm" />
                </button>

                <h1 className="font-poppins text-3xl font-semibold text-center mb-6">How to Register</h1>

                <div className="step-container overflow-auto mb-6 flex-grow">
                    <h2 className="font-poppins text-xl font-medium text-gray-700">{steps[currentStep].title}</h2>
                    <p className="font-poppins text-gray-600 mt-2 mb-5">{steps[currentStep].content}</p>
                    <img 
                        src={steps[currentStep].image} 
                        alt={`Step ${currentStep + 1}`} 
                        className="mx-auto mb-4 rounded-lg max-h-[200px] object-contain"
                    />
                </div>

                <div className="navigation-buttons flex justify-between items-center space-x-4 mt-4">       
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentStep === steps.length - 1}
                        className={`font-poppins text-md text-background rounded-lg w-5/12 py-2 shadow-md transition-all duration-500 ease-in-out
                            ${currentStep === steps.length - 1
                                ? "bg-btnBg opacity-50 cursor-not-allowed"
                                : "bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
                            }`}
                    >
                        Next
                    </button>

                </div>
            </div>
        </div>
    );
}
