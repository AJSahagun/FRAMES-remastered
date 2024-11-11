import React, { useEffect, useState } from 'react';

interface MediaDeviceInfo {
  deviceId: string;
  label: string;
}

interface WebcamSelectorProps {
  onDeviceSelect: (deviceId: string) => void;
  currentDeviceId?: string;
}

const WebcamSelector: React.FC<WebcamSelectorProps> = ({ onDeviceSelect, currentDeviceId }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadDevices = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Get list of video input devices
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`
          }));

        setDevices(videoDevices);
      } catch (err) {
        setError('Failed to access camera devices. Please check permissions.');
        console.error('Error accessing media devices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();

    // Listen for device changes (e.g., camera connected/disconnected)
    const handleDeviceChange = () => {
      loadDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onDeviceSelect(event.target.value);
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading cameras...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative">
      <select
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-700 text-sm"
        onChange={handleDeviceChange}
        value={currentDeviceId || ''}
      >
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WebcamSelector;