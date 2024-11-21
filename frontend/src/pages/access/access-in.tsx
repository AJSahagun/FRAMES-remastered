import '../../index.css';
import FosterWeelerTag from '../../components/FosterWheelerTag';
import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FaceRecognition from '../../components/FaceRecognition';
import { toast } from 'react-toastify';
import { db } from '../../config/db';
import { useSync } from './hooks/useSync';
import { findBestMatch } from '../../services/faceMatchService';

const userCodeRegex = /^(2\d-\d{5}$|P-\d{5})$/;

const validationSchema = Yup.object({
  user_code: Yup.string()
    .required('This field is required')
    .matches(userCodeRegex, 'Example format: "20-12345" or "P-12345"')
    .test(
      'is-valid-format',
      'SR-CODE format: 24-12345, Employee ID format: P-12345',
      value => {
        return /^2\d-\d{5}$/.test(value) || /^P-\d{5}$/.test(value);
      }
    )
});


export default function Access_IN() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [occupantCount, setOccupantCount] = useState<number>(0); // State to hold the count of occupants
  const [isConnected] = useSync()

  // Function to fetch the count of occupants from IndexedDB
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
  
    // 3. Cleanup function to clear both the timer and the polling interval when the component unmounts
    return () => {
      clearInterval(timer); 
      clearInterval(interval); 
    };
  }, []); 

  const date = new Date().toISOString()

  const handleFaceRecognition = async (faceDescriptor: number[]) => {
    try {
      // Process for Access in:
      // 1. Get request of face encodings from local db using 'school_id' (Sr-Code)
      // 2. Compare it with detected face descriptors
      // 3. If not match end, else get user name and display success
      // 4. Send post request in history (Local db) and update occupancy count
      // 5. Save face encodings and sr code in local db occupants table for check out later
      
      // Sample API call (Implement this using axios)
      const data = await findBestMatch(faceDescriptor);
      
      if(data){
        //  checks if user already has history
        const user = await db.occupants
        .where("schoolId")
        .equals(data.schoolId)
        .filter((user) => user.timeOut === null)
        .first();

        if(user){
          toast.warning(`Already encoded`);
        }
        else{
          // Add the occupant to the occupants table
          await db.occupants.add({
            name: data.name, 
            schoolId: data.schoolId, 
            timeIn: date,
            timeOut: null,
          });
          
          // count all occupants without timeOut
          const updatedCount = await db.occupants
            .filter(user => user.timeOut == null)
            .count();
          setOccupantCount(updatedCount);
          toast.success(`Welcome ${data.name}!`);
        }
      }
      else{
        toast.error('No face match detected, register first');
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      toast.error('Face recognition failed. Please try again or use your code.');
    }
  };

  return (
    <Formik
      initialValues={{ user_code: '' }}
      onSubmit={(value) => {
        console.log(value);
      }}
      validationSchema={validationSchema}>
      <Form>
        <div className="flex flex-col">
          {/* heading */}
          <div className="flex flex-row">
            <div>
              <h1 className="text-7xl gradient-text font-poppins font-medium ml-20 mt-16">
                Check-in
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
                <FaceRecognition onSuccess={handleFaceRecognition} isCheckIn={true} />
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
						<div className="w-1/2">
							<div className="flex justify-center mt-20">
								<img src="/logos/frames-square-logo.png" alt="FRAMES Logo" 
								className=""/>
							</div>

							<div className="flex flex-col items-center mt-12">
								<Field
									type="text"
									name="user_code"
									placeholder="Enter code"
									className="w-1/3 px-8 py-4 rounded-md bg-accent font-poppins text-white text-lg placeholder:text-lg placeholder:font-poppins  focus:outline-secondary ">		
								</Field>
								<ErrorMessage name="user_code" component="div" className="text-red-500 text-sm" />
							</div>

							<div className="flex flex-col items-center mt-16">
								<p>
									<span className="font-poppins font-semibold text-7xl gradient-text">{occupantCount}</span>
									<span className="font-poppins font-medium text-5xl text-accent">/</span>
									<span className="font-poppins font-semibold text-5xl text-accent">250</span>
								</p>
								<h2 className="font-noto_sans font-semibold text-5xl text-accent">OCCUPANTS</h2>
							</div>
              <div>
                {isConnected ? <h1>Connected</h1> : <h1>Disconnected</h1>}
              </div>

						</div>

					</div>


				</div>
			</Form>
		</Formik>
  );
}