import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface FaceRecognitionProps {
  onSuccess: (encoding: number[]) => void;
  isCheckIn?: boolean;
}

interface DetectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number>();
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const holdTimerRef = useRef<number>();
  const [holdProgress, setHoldProgress] = useState(0);

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
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(detectionIntervalRef.current);
      clearTimeout(holdTimerRef.current);
    };
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
      setIsVideoReady(false);
      clearInterval(detectionIntervalRef.current);
      
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          setVideoDimensions({
            width: videoRef.current?.videoWidth || 0,
            height: videoRef.current?.videoHeight || 0
          });
        };
        
        videoRef.current.onloadeddata = () => {
          setIsVideoReady(true);
        };
      }
    } catch (error) {
      console.error("Error accessing webcam: ", error);
      toast.error("Failed to access webcam. Please check your device permissions.");
    }
  };

  const isFaceInGuide = (detection: DetectionBox): boolean => {
    if (!videoRef.current) return false;

    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    const guideWidth = 240;
    const guideHeight = 366;
    const guideX = (videoWidth - guideWidth) / 2;
    const guideY = (videoHeight - guideHeight) / 2;
    const detectionCenterX = detection.x + (detection.width / 2);
    const detectionCenterY = detection.y + (detection.height / 2);
    const guideCenterX = guideX + (guideWidth / 2);
    const guideCenterY = guideY + (guideHeight / 2);
    const distance = Math.sqrt(
      Math.pow(detectionCenterX - guideCenterX, 2) +
      Math.pow(detectionCenterY - guideCenterY, 2)
    );

    return distance < (Math.min(guideWidth, guideHeight) / 2);
  };

  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    clearInterval(detectionIntervalRef.current);
    
    detectionIntervalRef.current = window.setInterval(async () => {
      if (!videoRef.current || !isVideoReady || videoRef.current.readyState !== 4) {
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
  
          if (isAligned && !isProcessing) {
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
                    processFace();
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
        console.error("Face detection error:", error);
        clearInterval(detectionIntervalRef.current);
        setTimeout(() => {
          if (isVideoReady && videoRef.current) {
            startFaceDetection();
          }
        }, 1000);
      }
    }, 100);
  };

  const processFace = async () => {
    if (!videoRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const useTinyModel = true;
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptor();

      if (detection) {
        const faceDescriptor = Array.from(detection.descriptor);
        onSuccess(faceDescriptor);
      } else {
        toast.warn("No face detected. Please try again.");
      }
    } catch (error) {
      console.error("Error processing face: ", error);
      toast.error("Face processing failed. Please try again.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="relative w-full h-0 pb-[75%] md:pb-[56.25%] lg:w-[640px] lg:h-[480px] lg:pb-0 border-4 border-dashed border-primary rounded-lg bg-gray-300">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
        />
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-72 lg:h-96
          border-4 border-white border-opacity-70 rounded-full
          transition-all duration-300 ease-in-out" 
        />

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

        {isProcessing && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-lg">
            <ClipLoader color="#ffffff" size={50} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FaceRecognition);