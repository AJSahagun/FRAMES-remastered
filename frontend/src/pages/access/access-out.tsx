import '../../index.css';
import FosterWeelerTag from '../../components/FosterWheelerTag';
import { useEffect, useState } from 'react';
import FaceRecognition from '../../components/FaceRecognition';
import { toast } from 'react-toastify';
import { db } from '../../config/db';
import { useBulkRequest } from './hooks/useBulkRequest';
import { findBestMatch } from '../../services/faceMatchService';
import { useSync } from './hooks/useSync';

export default function Access_OUT() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [occupantCount, setOccupantCount] = useState<number>(0); 
  const [rows, latestRequestTime]= useBulkRequest();
  const [isConnected] = useSync()
  const date2=new Date().toISOString()

  const fetchOccupantCount = async () => {
    try {
      const allOccupants = await db.occupants.toArray();
      const checkedOutOccupants = allOccupants.filter(occupant => occupant.timeOut);
      const currentOccupantCount = allOccupants.length - checkedOutOccupants.length; 
      setOccupantCount(currentOccupantCount); 
    } catch (error) {
      console.error('Error fetching occupant count:', error); 
    }
  };

  useEffect(() => {
    // 1. Timer that updates the time every second
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);
  
    // 2. Fetch the initial occupant count and poll every 1 second for updates
    fetchOccupantCount(); 
    const interval = setInterval(() => {
      fetchOccupantCount(); 
    }, 1000); 
    console.log(rows+": "+latestRequestTime)
  
    // 3. Cleanup function to clear both the timer and the polling interval when the component unmounts
    return () => {
      clearInterval(timer); 
      clearInterval(interval); 
    };
  }, [latestRequestTime]); 

  const date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});

  const handleFaceRecognition = async (faceDescriptor: number[]) => {
    const match = await findBestMatch(faceDescriptor);
    try {
      if(match){
        const data = await db.occupants
          .where("schoolId")
          .equals(match?.schoolId)
          .filter((record) => record.timeOut === null)
          .first();
        // 2. Check if an occupant was found (this step assumes your response returns the occupant data)
        if (data && data.timeOut ==null) {
          await db.occupants.update(data, { timeOut: date2 });
            // 7. Call fetchOccupantCount to update the count after checkout
            fetchOccupantCount();
            // 8. Show success toasts for checkout
            toast.success(`Goodbye ${data.name}!`);
        } else {
          // 9. No matching occupant found
          toast.error('Entry already recorded');
        }
      }
      else{
        toast.error('No matching occupant');
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      toast.error('Face recognition failed. Please try again or use your code.');
    }
  };

  return (
    <div className="flex flex-col">
      {/* heading */}
      <div className="flex flex-row">
        <div>
          <h1 className="text-7xl gradient-text font-poppins font-medium ml-20 mt-16">
            Check-out
          </h1>
        </div>
        <div>
          <FosterWeelerTag />
        </div>
      </div>

      {/* body */}
      <div className="flex flex-row">
        {/* left */}
        <div className="w-1/2 flex flex-col">
          <div className="w-3/5 ml-40 mt-10">
            <FaceRecognition onSuccess={handleFaceRecognition} isCheckIn={false} />
          </div>
          {/* clock */}
          <div className="flex justify-between w-full ml-24 mt-6">
            <div>
              <p className="font-poppins text-6xl font-[500] gradient-text tracking-wide">
                {time}
              </p>
              <p className="font-poppins text-xl -mt-2 font-medium gradient-text tracking-wide">
                {date}
              </p>
            </div>
              <div className="flex items-start mt-1 mr-8">
                <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-500' : 'text-primary'}`}>
                  <span className="font-poppins text-xl">{isConnected ? 'Online' : 'Offline'}</span>
                  <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-btnBg'}`} />
                  </div>
                </div>
              </div>
          </div>

        {/* right */}
        <div className="w-1/2 flex flex-col justify-center">
          <div className="flex justify-center mt-20">
            <img src="/logos/frames-square-logo.png" alt="FRAMES Logo" className="" />
          </div>

          <div className="flex flex-col items-center mt-12">
            <p className="font-noto_sans text-2xl">Please Scan your face before going out.</p>
          </div>

          <div className="flex flex-col items-center mt-12">
            <p>
              <span className="font-poppins font-semibold text-8xl gradient-text">{occupantCount}</span>
              <span className="font-poppins font-medium text-6xl text-accent">/</span>
              <span className="font-poppins font-semibold text-6xl text-accent">250</span>
            </p>
            <h2 className="font-noto_sans font-semibold text-6xl text-accent">OCCUPANTS</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
