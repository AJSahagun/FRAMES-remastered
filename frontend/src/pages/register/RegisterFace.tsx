import { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { FaCamera, FaRedo } from "react-icons/fa";

export default function RegisterFace() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const parameters = [
    "Well lit environment",
    "No other faces present",
    "Show full face",
    "Remove accessories",
    "Hold still",
  ];

  // 1. Load Face-API models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsModelsLoaded(true);
      } catch (error) {
        console.error("Error loading Face-API models: ", error);
      }
    };

    loadModels();
  }, []);

  // 2. Access Webcam using MediaDevices API
  useEffect(() => {
    if (isModelsLoaded && videoRef.current) {
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
          videoRef.current.srcObject = stream;
        } catch (error) {
          console.error("Error accessing webcam: ", error);
        }
      };

      startWebcam();
    }
  }, [isModelsLoaded]);

  // Handle window resize to adjust canvas size
  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3 & 4. Capture and process face detection + Generate face encodings
  const handleCapture = async () => {
    if (!isModelsLoaded || !videoRef.current) return;

    setIsCapturing(true);

    const video = videoRef.current;

    // Ensure video is ready
    if (video.readyState !== 4) {
      console.error("Video not ready for capture.");
      setIsCapturing(false);
      return;
    }

    // Create a canvas to capture the current frame
    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const captureContext = captureCanvas.getContext("2d");
    captureContext.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    const imageDataUrl = captureCanvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl); // Save captured image

    // Perform face detection on the captured image
    const img = await faceapi.fetchImage(imageDataUrl);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      // Save face descriptor
      setFaceDescriptor(Array.from(detections.descriptor));
      console.log("Face Descriptor:", detections.descriptor);

      // Draw detections on the main canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      }
    } else {
      console.warn("No face detected.");
      setFaceDescriptor(null);
      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    setIsCapturing(false);
  };

  // Reset the captured data
  const handleReset = () => {
    setCapturedImage(null);
    setFaceDescriptor(null);
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-tc font-poppins md:text-5xl lg:mt-2">Scan Face</h1>
      </div>

      <div className="container mx-auto p-4 
        md:mx-0 md:space-y-4 lg:flex-row lg:space-x-20 lg:w-screen lg:px-40 lg:mt-12">
        <div className="md:w-full md:flex md:flex-row-reverse md:items-start">
          <div className="md:w-1/2 mb-4 md:mb-0 md:ml-4 relative">
            <div className="bg-gray-200 rounded-lg max-w-md max-h-4xl w-full overflow-hidden">
              {/* Webcam feed or Captured Image */}
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-auto object-cover rounded-lg"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-auto object-cover rounded-lg"
                />
              )}

              {/* Canvas Overlay */}
              {capturedImage && (
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              )}

              {/* Capture and Reset Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {!capturedImage ? (
                  <button
                    onClick={handleCapture}
                    disabled={isCapturing}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center"
                  >
                    <FaCamera size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center"
                  >
                    <FaRedo size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
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
      </div>
    </div>
  );
}
