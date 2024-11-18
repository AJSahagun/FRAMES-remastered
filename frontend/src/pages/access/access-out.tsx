import '../../index.css';
import FosterWeelerTag from '../../components/FosterWheelerTag';
import { useEffect, useState } from 'react';
import FaceRecognition from '../../components/FaceRecognition';
import { toast } from 'react-toastify';
import { db } from '../../config/db';


export default function Access_OUT() {
	const [time, setTime] = useState(new Date().toLocaleTimeString());
	const [occupantCount, setOccupantCount] = useState<number>(0); 

	useEffect(() => {
		// 1. Timer that updates the time every second
		const timer = setInterval(() => {
		  setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
		}, 1000);
	  
		// 2. Function to fetch the count of occupants from IndexedDB
		const fetchOccupantCount = async () => {
		  try {
			const count = await db.occupants.count(); // Get count from IndexedDB
			setOccupantCount(count); // Update state with the count
		  } catch (error) {
			console.error('Error fetching occupant count:', error); // Log any error
		  }
		};
	  
		fetchOccupantCount(); // Fetch occupant count when the component mounts
	  
		// 3. Cleanup function to clear the timer when the component unmounts
		return () => clearInterval(timer);
	  }, []); // Empty dependency array, meaning this effect runs only once when the component mounts

	const date = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', });

	const handleFaceRecognition = async (faceDescriptor: number[]) => {
    try {
      // Process for Access out:
      // 1. Search for similar face descriptors in occupants table
      // 2. If none: return, else patch request time_out
			// 3. Drop row in occupants table
      
      // Sample API call (Implement this using axios)
      const response = await fetch('/api/face-recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faceDescriptor }),
      });

      if (!response.ok) {
        throw new Error('Face recognition failed');
      }

	  const data = {
        "id": 6,
        "name": "Bini",
        "schoolId": "80-10190",
       };
      
      // Check if the occupant is found
      if (data && data.id) {
        // 1. Successful recognition: Show success toast
        toast.success(`Goodbye ${data.name}!`);

        // 2. Delete the occupant from IndexedDB using their ID
		await db.occupants
		.where('id')
		.equals(data.id)
		.delete();  

        // 3. Update the occupant count after deletion
        const updatedCount = await db.occupants.count(); // Get the new occupant count
        setOccupantCount(updatedCount);

		// const response = await fetch('/api/v2/history', {
		// 	method: 'POST',
		// 	headers: {
		// 	  'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({ faceDescriptor }),
		//   });
	
		//   if (!response.ok) {
		// 	throw new Error('Face recognition failed');
		//   }

        // Optionally, show a toast with the updated count (or just update the state)
        toast.info(`Remaining Occupants: ${updatedCount}`);
      } else {
        toast.error('No matching occupant found.');
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
				<div className="">
					<FosterWeelerTag/>
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
					<div className="w-max ml-24 mt-6">
						<p className="font-poppins text-6xl font-[500] gradient-text tracking-wide">
							{time}
						</p>
						<p className="font-poppins text-xl -mt-2 font-medium gradient-text tracking-wide">
							{date}
						</p>
					</div>
				</div>

				{/* right */}
				<div className="w-1/2 flex flex-col justify-center">
					<div className="flex justify-center mt-20">
						<img src="/logos/frames-square-logo.png" alt="FRAMES Logo" 
						className=""/>
					</div>

					<div className="flex flex-col items-center mt-12">
						<p className='font-noto_sans text-2xl'>Please Scan your face before going out.</p>
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
	)
};