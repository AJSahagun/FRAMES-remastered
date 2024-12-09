import FosterWeelerTag from '../../components/FosterWheelerTag';
import { useEffect, useState, useRef } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikProps  } from 'formik';
import * as Yup from 'yup';
import FaceRecognition from '../../components/FaceRecognition';
import { toast } from 'react-toastify';
import { db } from '../../config/db';
import { useSync } from './hooks/useSync';
import { findBestMatchBySchoolId } from '../../services/facematch.service';
import { Encodings } from '../../types/db.types';
import { SettingsService } from '@/services/settings.service';

interface FormValues {
  schoolId: string;
}

const userCodeRegex = /^(2\d-\d{5}$|P-\d{5})$/;

const validationSchema = Yup.object({
  schoolId: Yup.string()
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
  const [occupantCount, setOccupantCount] = useState<number>(0);
  const { syncStatus } = useSync();
  const [shouldCapture, setShouldCapture] = useState(false);
  const [occupantLimit, setOccupantLimit] = useState<number>(0);
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const date = new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
  const date2 = new Date().toISOString();

  const fetchOccupantCount = async () => {
    try {
      const allOccupants = await db.occupants.toArray();
      const checkedOutOccupants = allOccupants.filter(occupant => occupant.time_out);
      const currentOccupantCount = allOccupants.length - checkedOutOccupants.length;
      setOccupantCount(currentOccupantCount);
    } catch (error) {
      console.error('Error fetching occupant count:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);

    const interval = setInterval(() => {
      fetchOccupantCount();
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchOccupantLimit = async () => {
      try {
        const response = await SettingsService.getMaxOccupants();
        setOccupantLimit(response.max_occupants);
      } catch (error) {
        console.error("Error fetching occupant limit:", error);
        toast.error("Failed to load current occupant limit.", {
          position: "top-center",
        });
      }
    };

    fetchOccupantLimit();
  }, []);

  const recordLatestEncoding = async (data:Encodings)=>{
    await db.encodings.add({
      date_created: data.date_created,
      name: data.name,
      school_id: data.school_id,
      encoding: data.encoding
    });

    // delete old encodings here
    const userRecords = await db.encodings
    .where('school_id')
    .equals(data.school_id)
    .sortBy('date_created'); // Returns sorted records for this user

    if (userRecords.length > 5) {
      const recordsToDelete = userRecords.slice(0, userRecords.length - 5); // Keep the latest 5
      const idsToDelete:any = recordsToDelete.map((record) => record.id);
  
      await db.encodings.bulkDelete(idsToDelete);
    }

  }

  const handleFaceRecognition = async (faceDescriptor: number[]) => {
    try {
      const schoolId = formikRef.current?.values.schoolId;
      
      if (!schoolId) {
        toast.error('Please enter a valid School ID');
        return;
      }
  
      const data = await findBestMatchBySchoolId(faceDescriptor, schoolId);
      
      if (data) {
        const user = await db.occupants
          .where("school_id")
          .equals(data.school_id)
          .filter((user) => user.time_out === null)
          .first();
  
        if (user) {
          toast.warning(`Already encoded`);
        } else {
          await db.occupants.add({
            name: data.name,
            school_id: data.school_id,
            time_in: date2,
            time_out: null,
          });
          
          recordLatestEncoding({
            ...data, 
            date_created: date2, 
            encoding: faceDescriptor
          });
  
          const updatedCount = await db.occupants
            .filter(user => user.time_out == null)
            .count();
          setOccupantCount(updatedCount);
          toast.success(`Welcome ${data.name}!`);
          
          formikRef.current?.resetForm();
          setShouldCapture(false);
        }
      } else {
        toast.error('Face does not match.');
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      toast.error('Face recognition failed. Please try again or use your code.');
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ schoolId: '' }}
      onSubmit={() => {
      }}
      validationSchema={validationSchema}>
      {(formikProps) => {
        const isValid = formikProps.isValid && formikProps.values.schoolId !== '';
        if (isValid && !shouldCapture) {
          setShouldCapture(true);
        } else if (!isValid && shouldCapture) {
          setShouldCapture(false);
        }

        return (
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
                  <FosterWeelerTag />
                </div>
              </div>

              {/* body */}
              <div className="flex flex-row">
                {/* left */}
                <div className="w-1/2 flex flex-col">
                  <div className="w-3/5 ml-40 mt-10">
                    <FaceRecognition 
                      onSuccess={handleFaceRecognition} 
                      isCheckIn={true}
                      shouldCapture={shouldCapture} 
                    />
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
                      <div className={`flex items-center space-x-2 ${syncStatus.isConnected ? 'text-green-500' : 'text-primary'}`}>
                        <span className="font-poppins text-xl">{syncStatus.isConnected ? 'Online' : 'Offline'}</span>
                        <div className={`w-4 h-4 rounded-full ${syncStatus.isConnected ? 'bg-green-500' : 'bg-btnBg'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="w-1/2">
                  <div className="flex justify-center mt-20">
                    <img src="/logos/frames-square-logo.png" alt="FRAMES Logo" className="" />
                  </div>

                  <div className="flex flex-col items-center mt-12">
                    <div className="relative w-1/3">
                      <Field
                        type="text"
                        name="schoolId"
                        placeholder="Enter code"
                        autoComplete="off"
                        className="w-full px-8 py-4 rounded-md bg-accent font-poppins text-white text-lg placeholder:text-lg placeholder:font-poppins focus:outline-secondary"
                      />
                      {formikProps.values.schoolId && (
                        <button
                          type="button"
                          onClick={() => formikProps.setFieldValue('schoolId', '')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <ErrorMessage name="schoolId" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="flex flex-col items-center mt-16">
                    <p>
                      <span className="font-poppins font-semibold text-7xl gradient-text">{occupantCount}</span>
                      <span className="font-poppins font-medium text-5xl text-accent">/</span>
                      <span className="font-poppins font-semibold text-5xl text-accent">{occupantLimit}</span>
                    </p>
                    <h2 className="font-noto_sans font-semibold text-5xl text-accent">OCCUPANTS</h2>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}