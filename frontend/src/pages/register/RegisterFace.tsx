import React, { useEffect, useRef, useState} from "react";
import * as faceapi from "@vladmandic/face-api";
import WebcamSelector from "../../components/WebcamSelector";
import { useImageStore } from "./stores/useImgStore";
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { FaRedo } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import { UserRegistrationData } from '../../types/user.types';

interface RegisterFaceProps {
  formData: UserRegistrationData;
}

interface DetectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const RegisterFace: React.FC<RegisterFaceProps> = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number>();
  const holdTimerRef = useRef<number>();
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { setImageUrl } = useImageStore();
  const { setLocalFormData } = useRegistrationStore();
  const [isCapturing, setIsCapturing] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [holdProgress, setHoldProgress] = useState(0);
  const parameters = [
    "Well lit environment",
    "No other faces present",
    "Show full face",
    "Remove accessories",
    "Hold still",
  ];

  // Load only necessary Face-API models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models")
        ]);
        setIsModelsLoaded(true);
      } catch (error) {
        console.error("Error loading Face-API models: ", error);
        toast.error("Failed to load face recognition models.");
      }
    };

    loadModels();
    
    // Cleanup function to stop the camera stream
    const cleanup = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(detectionIntervalRef.current);
      clearTimeout(holdTimerRef.current);
    };

    // Return the cleanup function
    return cleanup;
  }, []);

  useEffect(() => {
    if (isModelsLoaded && videoRef.current) {
      startWebcam();
    }
  }, [isModelsLoaded]);

  useEffect(() => {
    if (isVideoReady && isModelsLoaded && videoRef.current) {
      startFaceDetection();
    }
    
    return () => {
      clearInterval(detectionIntervalRef.current);
    };
  }, [isVideoReady, isModelsLoaded]);

  const startWebcam = async (deviceId?: string) => {
    try {
      setIsVideoReady(false); // Reset video ready state
      clearInterval(detectionIntervalRef.current); // Clear existing detection interval
      
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Stop previous stream if it exists
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be fully loaded
        videoRef.current.onloadedmetadata = () => {
          setVideoDimensions({
            width: videoRef.current?.videoWidth || 0,
            height: videoRef.current?.videoHeight || 0
          });
        };
        
        // Additional check for video readiness
        videoRef.current.onloadeddata = () => {
          setIsVideoReady(true);
        };
      }
    } catch (error) {
      console.error("Error accessing webcam: ", error);
      toast.error("Failed to access webcam. Please check your device permissions.");
    }
  };

  const handleDeviceSelect = async (deviceId: string) => {
    setHoldProgress(0);
    clearInterval(holdTimerRef.current);
    clearInterval(detectionIntervalRef.current);
    
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    setSelectedDeviceId(deviceId);
    await startWebcam(deviceId);
  };

  const isFaceInGuide = (detection: DetectionBox): boolean => {
    if (!videoRef.current) return false;

    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    // Calculate guide circle dimensions
    const guideWidth = 192; // 12rem in pixels
    const guideHeight = 256; // 16rem in pixels
    
    // Calculate guide position (center of video)
    const guideX = (videoWidth - guideWidth) / 2;
    const guideY = (videoHeight - guideHeight) / 2;

    // Check if face detection box is mostly within the guide circle
    const detectionCenterX = detection.x + (detection.width / 2);
    const detectionCenterY = detection.y + (detection.height / 2);

    // Calculate distance from center of detection to center of guide
    const guideCenterX = guideX + (guideWidth / 2);
    const guideCenterY = guideY + (guideHeight / 2);

    const distance = Math.sqrt(
      Math.pow(detectionCenterX - guideCenterX, 2) +
      Math.pow(detectionCenterY - guideCenterY, 2)
    );

    // Check if detection center is within the guide circle
    return distance < (Math.min(guideWidth, guideHeight) / 2);
  };

  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    clearInterval(detectionIntervalRef.current); // Clear any existing interval
    
    detectionIntervalRef.current = window.setInterval(async () => {
      // Check if video is still valid and ready
      if (!videoRef.current || !isVideoReady || 
          videoRef.current.readyState !== 4) {
        return;
      }
      
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
  
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        if (detections.length === 1) {
          const detection = detections[0].box;
          const isAligned = isFaceInGuide(detection);
  
          if (isAligned) {
            if (!holdTimerRef.current) {
              let progress = 0;
              const startTime = Date.now();
              holdTimerRef.current = window.setInterval(() => {
                const elapsed = Date.now() - startTime;
                progress = Math.min((elapsed / 3000) * 100, 100);
                setHoldProgress(progress);
                
                if (progress >= 100) {
                  clearInterval(holdTimerRef.current);
                  holdTimerRef.current = undefined;
                  handleCapture();
                }
              }, 100);
            }
          } else {
            if (holdTimerRef.current) {
              clearInterval(holdTimerRef.current);
              holdTimerRef.current = undefined;
              setHoldProgress(0);
            }
          }
  
          // Draw detection box
          context.strokeStyle = isAligned ? '#00FF00' : '#FF0000';
          context.strokeRect(detection.x, detection.y, detection.width, detection.height);
        } else {
          if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current);
            holdTimerRef.current = undefined;
            setHoldProgress(0);
          }
        }
      } catch (error) {
        // If we get an error during detection, clear the interval and restart
        console.error("Face detection error:", error);
        clearInterval(detectionIntervalRef.current);
        // Optional: attempt to restart detection after a short delay
        setTimeout(() => {
          if (isVideoReady && videoRef.current) {
            startFaceDetection();
          }
        }, 1000);
      }
    }, 100);
  };

  const handleCapture = async () => {
    if (!isModelsLoaded || !videoRef.current) return;

    setIsCapturing(true);
    clearInterval(detectionIntervalRef.current);
    clearInterval(holdTimerRef.current);

    const video = videoRef.current;
    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const captureContext = captureCanvas.getContext("2d");
    
    if (!captureContext) {
      console.error("Failed to get canvas context");
      setIsCapturing(false);
      return;
    }

    captureContext.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    const imageDataUrl = captureCanvas.toDataURL("image/png");
    setImageUrl(imageDataUrl);
    setCapturedImage(imageDataUrl);

    try {
      const img = await faceapi.fetchImage(imageDataUrl);
      const useTinyModel = true;
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptor();

      if (detection) {
        setLocalFormData({ 
          encoding: Array.from(detection.descriptor) 
        });

        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetection = faceapi.resizeResults(detection, displaySize);
          
          const context = canvas.getContext("2d");
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetection);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
          }
        }
      } else {
        toast.warn("No face detected in captured image. Please try again.");
        handleReset();
      }
    } catch (error) {
      console.error("Error during face detection: ", error);
      toast.error("Face detection failed. Please try again.");
      handleReset();
    }

    setIsCapturing(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setLocalFormData({ encoding: [] });
    setHoldProgress(0);
    
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    startWebcam();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <ToastContainer />
      <div className="text-center">
        <h1 className="text-tc font-poppins font-semibold md:text-5xl lg:mt-2">Scan Face</h1>
      </div>

      <div className="container mx-auto p-4 
        md:mx-0 md:space-y-4 lg:flex-row lg:space-x-20 lg:w-screen lg:px-40 lg:mt-12">
        <div className="md:w-full md:flex md:flex-row-reverse md:items-start">
          <div className="md:w-1/2 mb-4 md:mb-0 md:ml-4 relative">
            <div className="rounded-lg max-w-md max-h-4xl w-full overflow-hidden">
            <div className="mb-4">
              <WebcamSelector 
                onDeviceSelect={handleDeviceSelect}
                currentDeviceId={selectedDeviceId}
              />
            </div>
              <div className="relative w-full h-0 pb-[75%] md:pb-[56.25%] lg:w-[448px] lg:h-[336px] lg:pb-0">
                {capturedImage ? (
                  <>
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    />
                    {isCapturing && (
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-gray-700">
                        <ClipLoader color="#ffffff" size={50} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-48 lg:h-64
                      border-4 border-white border-opacity-70 rounded-full
                      transition-all duration-300 ease-in-out" />
                    {holdProgress > 0 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${holdProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  width={videoDimensions.width}
                  height={videoDimensions.height}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {capturedImage && (
                  <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center"
                  >
                    <FaRedo className="size-3 md:size-2 lg:size-5 lg:m-1"/>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-1/2 self-center">
            <ul className="space-y-2 justify-end">
              {parameters.map((param, index) => (
                <li key={index} className="flex items-center justify-end">
                  <h3 className="text-sm lg:text-2xl xl:text-3xl font-noto_sans pr-1">
                    {param}
                  </h3>
                  <svg
                    className="w-5 h-5 mr-2 text-gray-500 lg:size-5 xl:size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-4 text-center">
          Note: Please ensure your face is within the circle and hold still for 3 seconds.
        </p>
      </div>
    </div>
  );
}

export default React.memo(RegisterFace);