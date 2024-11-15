import '../../index.css';
import FosterWeelerTag from '../../components/FosterWheelerTag';
import { useEffect, useState } from 'react';
import FaceRecognition from '../../components/FaceRecognition';
import { toast } from 'react-toastify';


export default function Access_OUT() {
	const [time, setTime] = useState(new Date().toLocaleTimeString());

	useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

      const data = await response.json();
      
      // Handle successful check-in
      toast.success(`Welcome ${data.userName}!`);
      
      // You might want to update the occupancy count here
      
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
							<span className="font-poppins font-semibold text-8xl gradient-text">78</span>
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