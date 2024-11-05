import React from "react";
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Dropdown from "../../components/Dropdown";
import { UserRegistrationData } from '../../types/user.types';

const departmentOptions = [
  { value: "CAFAD", label: "College of Architecture, Fine Arts & Design" },
  { value: "CET", label: "College of Engineering Technology" },
  { value: "CICS", label: "College of Informatics and Computing Sciences" },
  { value: "COE", label: "College of Engineering" },
];

const courseOptions: Record<string, { value: string; label: string }[]> = {
  CAFAD: [
    { value: "BSArch", label: "BS Architecture" },
    { value: "BFA", label: "Bachelor of Fine Arts" },
    { value: "BSID", label: "BS Interior Design" },
  ],
  CET: [
    { value: "BAutoEngTech", label: "Bachelor of Automotive Engineering Technology" },
    { value: "BCompEngTech", label: "Bachelor of Computer Engineering Technology" },
    { value: "BCivEngTech", label: "Bachelor of Civil Engineering Technology" },
  ],
  CICS: [
    { value: "BSCS", label: "BS Computer Science" },
    { value: "BSIT", label: "BS Information Technology" },
  ],
  COE: [
    { value: "BSAeroEng", label: "BS Aerospace Engineering" },
    { value: "BSAutoEng", label: "BS Automotive Engineering" },
    { value: "BSBioMedEng", label: "BS Biomedical Engineering" },
  ],
};

interface InputInfoProps {
  formData: UserRegistrationData;
}

const InputInfo: React.FC<InputInfoProps> = () => {
  const { localFormData, setLocalFormData, setIsFormValid, selectedDept, setSelectedDept, setSelectedProgram } = useRegistrationStore();

  const handleSubmit = (values: typeof localFormData) => {
    setLocalFormData(values);
    setIsFormValid(true);
  };

  // Updated the handleDepartmentChange logic to set selectedDept and course properly
  const handleDepartmentChange = (value: string, setFieldValue: (field: string, value: string | null) => void) => {
    setSelectedDept(value);  // Update Zustand store's selected department
    setFieldValue('department', value);  // Update Formik's department field
    setFieldValue('course', '');  // Reset the course field
    setSelectedProgram(courseOptions[value] || []);  // Update the program options in Zustand store
  };

  const handleProgramChange = (value: string, setFieldValue: (field: string, value: string | null) => void) => {
    setFieldValue('course', value);  // Update Formik's course field
  };

  // Ensure currentProgramOptions derives from Zustand's selectedDept
  const currentProgramOptions = selectedDept ? courseOptions[selectedDept] : [];

  return (
    <Formik
      initialValues={localFormData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      className="w-full"
    >
      {({ setFieldValue }) => (
        <Form className="w-full flex flex-col relative items-center">
          <div className="text-center">
            <h1 className="text-tc font-poppins md:text-5xl lg:mt-2 lg:mb-10">Registration</h1>
          </div>

          <div className="w-full relative flex flex-col lg:flex-row lg:w-3/4 items-center justify-center mt-8 space-y-3 lg:space-x-2">
            {/* left */}
            <div className="space-y-3 mx-8 lg:w-1/2 justify-center items-center">
            <Field
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
            />
            <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="middleName"
              placeholder="Middle Name"
              className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
            />
            <ErrorMessage name="middleName" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
            />
            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />

            <Field
              type="text"
              name="suffix"
              placeholder="Suffix (e.g. Jr.)"
              className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
            />
            <ErrorMessage name="suffix" component="div" className="text-red-500 text-sm" />

            </div>

            {/* right */}
            <div className="space-y-3 mx-8 lg:w-1/2 justify-center items-center">
            <Field
              type="text"
              name="srCode"
              placeholder="SR-CODE/Employee ID"
              className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
            />
            <ErrorMessage name="srCode" component="div" className="text-red-500 text-sm" />

            <Dropdown
              options={departmentOptions}
              value={selectedDept}
              onChange={(value) => handleDepartmentChange(value, setFieldValue)}
              placeholder="Select College"
            />

          <Dropdown
            options={currentProgramOptions}
            value={localFormData.program}  // Formik's program field
            onChange={(value) => handleProgramChange(value, setFieldValue)}  // Handle program selection
            placeholder="Select Program"
            disabled={!selectedDept}  // Disable if department not selected
          />

            </div>



          </div>

          <button type="submit" className="hidden">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(InputInfo);

