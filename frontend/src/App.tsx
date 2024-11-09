import { useSidebarStore } from './stores/useSidebarStore';
import { useSliderStore } from './stores/useSliderStore';
import { useImageStore } from './stores/useImageStore';
import { useEffect, useMemo } from 'react';

export default function App() {
  const { isOpen, toggleSidebar } = useSidebarStore(); 
  const { activeIndex, setActiveIndex } = useSliderStore();
  const { imagesLoaded, setImagesLoaded } = useImageStore(); // Zustand store for imagesLoaded

  const images = useMemo(() => [
    "/images/library.jpg",
    "/images/library-2.jpg",
    "/images/library-3.jpg", 
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval); // Cleanup
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
        setImagesLoaded(true); // Use Zustand store
      } catch (error) {
        console.error("Failed to load images", error);
      }
    };

    loadImages();
  }, [images, setImagesLoaded]);

  return (
    <div className="relative w-full max-h-screen">
      {/* Navbar */}
      <div className="flex flex-row w-full justify-between items-center ">
        <div className="w-1/2 md:w-1/3">
        <a href="/">
          <img className="mt-6 ml-6 md:w-1/2 lg:w-1/2 lg:ml-6 xl:w-1/3 xl:ml-12" src="/logos/FRAMES_title-logo.png" alt="FRAMES logo"  />
        </a>
        </div>
        <div className="hidden w-2/3 md:flex flex-row justify-end items-center space-x-14 mt-8 mr-24 lg:ml-36 xl:mt-1 text-tc">
        <a href="/" className="w-auto">
          <p className="font-poppins">Home</p></a>
        <a href="/schedule" className="w-auto">
          <p className="font-poppins">Schedule</p></a>
        <a href="/about-us" className="w-auto">
          <p className="font-poppins" >About us</p></a>
        <a href="/register" className="w-32">
          <button className="w-full bg-gradient-to-br from-accent to-btnBg text-background text-sm py-3 rounded-md font-poppins font-extralight shadow-lg hover:brightness-150 duration-300">
            Register
          </button></a>
        </div>
        <div className="w-1/2 flex justify-end md:hidden">
          <button className="p-2 px-4" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white text-tc shadow-lg transform 
          ${isOpen ? 'translate-x-0 z-50' : 'translate-x-full z-50'} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <ul className="mt-4 space-y-3">
            <li><a href="#" className="block font-poppins text-lg text-center">Home</a></li>
            <li><a href="#" className="block font-poppins text-lg text-center">Schedule</a></li>
            <li><a href="#" className="block font-poppins text-lg text-center">About us</a></li>
          </ul>
        </div>

        <div className="w-full flex my-10 justify-center items-center">
          <button className="w-2/3 bg-gradient-to-br from-accent to-btnBg text-background py-2 rounded-md font-poppins font-extralight shadow-lg ">
            Register
          </button>
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

          <div className="relative w-full h-56 md:h-96 lg:flex lg:h-5/6 lg:mt-8">
            {imagesLoaded && images.map((img, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  className="object-cover w-full h-full rounded shadow-lg lg:rounded-none lg:shadow-none"
                  src={img}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>
          {/* Foster Wheeler Tag */}
          <div className="hidden lg:flex w-4/6 absolute bottom-14 right-0 mt-8 ml-10 text-poppins">
            <div className="flex w-full ">
              <div className="flex w-full h-10 px-9 pr-1 bg-primary py-6 justify-center items-center  text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                <p className="text-lg text-poppins md:text-base align-middle tracking-wide">
                  Foster Wheeler - Alangilan
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
        <div className="relative flex flex-col items-start w-full max-w-xl px-8 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
          <div className="mb-16 lg:my-40 lg:max-w-lg lg:pr-5 min-[430px]:px-2">
            <h2 className="mb-5 text-3xl font-medium tracking-tight font-poppins text-tc sm:text-6xl sm:leading-none">
              Access the{' '}
              <br className="hidden md:block" />
              Campus Library{' '}
              <span className="inline-block text-400">
                Seamlessly
              </span>
            </h2>
            <p className="pr-5 mb-5 text-base font-light font-noto_sans md:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            </p>
            <div className="flex items-center">
              <a href="/register">
                <button className="inline-flex items-center justify-center h-12 px-6 mr-6 font-poppins font-medium tracking-wide text-white transition duration-300 rounded-md shadow-md bg-btnBg hover:brightness-110 hover:-translate-y-2 focus:shadow-outline focus:outline-none" >
                  REGISTER NOW
                </button>

              </a>
              <a href = "/registrationguide">
              <button className="inline-flex items-center font-semibold text-gray-800 transition-colors duration-200 hover:text-accent">
                Learn more
              </button>
              </a>
            </div>
            <div className="flex">
              <p className="mt-4 text-sm text-accent italic opacity-60 font-noto_sans xl:not-italic">
                Powered by Techtonic
              </p>
            </div>
          </div>
          
          {/* Second Slider Indicator */}
          <div className="justify-center items-center space-x-3 my-6 hidden">
        
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
        <div className="flex justify-center items-center bottom-5 font-poppins text-accent text-sm opacity-40 lg:hidden">
          Foster Wheeler - Alangilan
        </div>
      </div>

      
    </div>
  );
}
