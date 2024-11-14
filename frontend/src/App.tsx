import { useSidebarStore } from './stores/useSidebarStore';
import { useSliderStore } from './stores/useSliderStore';
import { useImageStore } from './stores/useImageStore';
import { useEffect, useMemo, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function App() {
  const { isOpen, toggleSidebar } = useSidebarStore(); 
  const { activeIndex, setActiveIndex } = useSliderStore();
  const { imagesLoaded, setImagesLoaded } = useImageStore();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const images = useMemo(() => [
    "images/face-scan-1.jpg",
    "/images/library.jpg",
    "/images/library-2.jpg",
    "/images/library-3.jpg", 
  ], []);
  
  const steps = [
    { title: "Step 1: Provide Your Information", content: "Enter your personal details.", image: "/images/userguide-1.jpg" },
    { title: "Step 2: Register Your Face", content: "Allow the system to capture your face.", image: "/images/userguide-2.jpg" },
    { title: "Step 3: Verify Your Registration", content: "Check if information in the fields are correct.", image: "/images/userguide-3.jpg" },
    { title: "Step 4: Confirm", content: "After checking, confirm your registration.", image: "/images/userguide-4.jpg" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 1024) {
        const newIndex = (activeIndex + 1) % images.length;
        setActiveIndex(newIndex);
      }  
    }, 6000);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setActiveIndex(0);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeIndex, images.length, setActiveIndex]);

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = images.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to load images", error);
      }
    };

    loadImages();
  }, [images, setImagesLoaded]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExit = () => {
    window.location.href = '/';
  };

  const handleSkip = () => {
    window.location.href = '/register';
  };

  const handleRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div className="relative w-full max-h-screen overflow-y-hidden">
      {/* Navbar */}
      <div className="flex flex-row w-full justify-between items-center ">
        <div className="w-1/2 md:w-1/3">
          <a href="/">
            <img className="mt-6 ml-6 md:w-1/2 lg:w-1/2 lg:ml-6 xl:w-1/3 xl:ml-12" src="/logos/FRAMES_title-logo.png" alt="FRAMES logo" />
          </a>
        </div>
        <div className="hidden w-2/3 md:flex flex-row justify-end items-center space-x-14 mt-8 mr-24 lg:ml-36 xl:mt-1 text-tc">
          <a href="/" className="w-auto"><p className="font-poppins">Home</p></a>
          <a href="#tutorial" onClick={() => setShowGuideModal(true)} className="w-auto"><p className="font-poppins">Tutorial</p></a>
          <a href="/techtonic" className="w-auto"><p className="font-poppins" >Techtonic</p></a>
          <a href="/register" className="w-32">
            <button className="w-full bg-gradient-to-br from-accent to-btnBg text-background text-sm py-3 rounded-md font-poppins font-extralight shadow-lg hover:brightness-150 duration-300">
              Register
            </button>
          </a>
        </div>
        <div className="w-1/2 flex justify-end md:hidden">
          <button className="p-2 px-4" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {showGuideModal && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="bg-white m-8 p-8 rounded-lg shadow-lg max-w-md w-full h-[520px] flex flex-col justify-between relative">
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
              {/* Step 1 */}
              {currentStep === 0 && (
                <>
                  <button
                    onClick={handleSkip}
                    className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg text-md text-background rounded-lg w-5/12 py-2 transition-all duration-500 ease-in-out"
                  >
                    Next
                  </button>
                </>
              )}

              {/* Step 2 and 3 */}
              {(currentStep === 1 || currentStep === 2) && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg text-md text-background rounded-lg w-5/12 py-2 transition-all duration-500 ease-in-out"
                  >
                    Next
                  </button>
                </>
              )}


              {/* Step 4 */}
              {currentStep === 3 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="border-2 border-tc hover:bg-tc hover:text-background font-poppins text-tc rounded-lg w-5/12 py-2 transition-colors duration-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleRegister}
                    className="bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg text-md text-background rounded-lg w-5/12 py-2 transition-all duration-500 ease-in-out"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white text-tc shadow-lg transform 
          ${isOpen ? 'translate-x-0 z-50' : 'translate-x-full z-50'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <ul className="mt-4 space-y-3">
            <li><a href="/" className="block font-poppins text-lg text-center">Home</a></li>
            <li><a href="#tutorial" onClick={() => setShowGuideModal(true)} className="block font-poppins text-lg text-center">Tutorial</a></li>
            <li><a href="/techtonic" className="block font-poppins text-lg text-center">Techtonic</a></li>
          </ul>
        </div>

        <div className="w-full flex my-10 justify-center items-center">
          <a href="/register" className="w-full flex justify-center items-center">
            <button className="w-2/3 bg-gradient-to-br from-accent to-btnBg text-background py-2 rounded-md font-poppins font-extralight shadow-lg ">
              Register
            </button>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full relative flex-col-reverse py-16 lg:pt-0 lg:flex-col lg:pb-0">
        <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
          <svg
            className="absolute left-0 hidden h-full text-background transform -translate-x-1/2 lg:block"
            viewBox="0 0 100 100"
            fill="currentColor"
            preserveAspectRatio="none slice"
          >
            <path d="M50 0H100L50 100H0L50 0Z" />
          </svg>

          {/* Image slider */}
          <div className="relative w-full h-60 md:h-96 lg:flex lg:h-4/5 lg:mt-4 fade-in-up">
            {imagesLoaded && images.map((img, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  className="object-cover w-full h-full rounded-lg shadow-lg lg:rounded-none lg:shadow-none"
                  src={img}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
            
          </div>
          {/* Foster Wheeler Tag */}
          <div className="hidden lg:flex w-3/5 absolute right-0 -mt-6 ml-10 font-poppins fade-in-up">
            <div className="flex w-full ">
              <div className="flex w-full h-10 px-9 pr-1 bg-primary py-6 justify-center items-center  text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                <p className="text-lg font-poppins md:text-base align-middle tracking-wide">
                  Foster Wheeler Library - Alangilan
                </p>
              </div>
              <div className="">
                <img className="absolute w-24 -left-4 -top-4 " src="/logos/batstateu-logo.png" alt="Logo" />
              </div>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="flex justify-center items-center space-x-3 my-6 lg:hidden">
            {images.map((_, index) => (
              <span
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`${
                  index === activeIndex ? 'w-9 rounded-full opacity-70' : 'w-3 opacity-30'
                } h-3 bg-secondary rounded-full transition-all ease-in-out duration-300 cursor-pointer`}
              />
            ))}
          </div>

        </div>
        <div className="flex items-start w-full max-w-xl px-8 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">

          {/* White Rectangle */}
          <div className="hidden lg:block absolute w-full h-full -left-0 bg-background " 
            style={{ clipPath: 'polygon(0 0, 70% 0, 45% 100%, 0% 100%)',
              zIndex: 1,
            }}>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center mb-16 z-20 lg:mb-48 lg:mt-24 lg:pr-5 min-[430px]:px-2 -ml-6 ">
            <div className="mb-5 text-3xl font-medium tracking-tight lg:tracking-tight font-poppins text-tc sm:text-6xl sm:leading-none lg:text-8xl lg:-space-y-2 fade-in-up ">  
              <h2>Access the</h2>
              <h2>Campus Library</h2>
              <h2>with {' '}
                <span className="inline-block text-400 text-primary font-aldrich lg:text-8xl">
                  FRAMES
                </span>
              </h2>
            </div>
            <p className="pr-5 mb-5 font-light font-noto_sans md:text-lg fade-in-up">
              Face Recognition Access Monitoring Enhanced System [FRAMES] is a ...
            </p>
            <div className="flex items-center">
              <a href="/register">
                <button className="inline-flex items-center justify-center h-12 px-6 mr-6 font-poppins font-medium tracking-wide text-white transition duration-300 rounded-md shadow-md bg-btnBg hover:brightness-110 hover:-translate-y-2 focus:shadow-outline focus:outline-none fade-in-up">
                  REGISTER NOW
                </button>
              </a>
              <button className="inline-flex items-center justify-center h-12 px-6 mr-6 font-poppins font-semibold tracking-wide bg-slate-200 text-accent bg-sf rounded-md shadow-md transition duration-500 hover:bg-slate-300 fade-in-up">
                Learn more
              </button>
            </div>
            <div className="flex">
              <p className="mt-4 text-sm text-accent italic opacity-60 font-noto_sans xl:not-italic fade-in-up">
                Powered by Techtonic
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}