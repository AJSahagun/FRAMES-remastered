import '../../index.css';
import FosterWeelerTag from '../../components/FosterWheelerTag';
import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FaceRecognition from '../../components/FaceRecognition';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', });

  const handleFaceRecognition = async (faceDescriptor: number[]) => {
    try {
      // Here you would typically:
      // 1. Send the face descriptor to your backend
      // 2. Compare it with stored face descriptors
      // 3. Get the matching user code
      // 4. Process the check-in
      
      // Example API call (you'll need to implement this):
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
									<span className="font-poppins font-semibold text-7xl gradient-text">78</span>
									<span className="font-poppins font-medium text-5xl text-accent">/</span>
									<span className="font-poppins font-semibold text-5xl text-accent">250</span>
								</p>
								<h2 className="font-noto_sans font-semibold text-5xl text-accent">OCCUPANTS</h2>
							</div>

						</div>

					</div>


				</div>
			</Form>
		</Formik>
  );
}