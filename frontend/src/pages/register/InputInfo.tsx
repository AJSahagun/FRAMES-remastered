import React from "react";
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { useSrCodeStore } from "./stores/srCodeStore";
import { useDeptStore } from "./stores/useDeptStore"; 
import Dropdown from "../../components/Dropdown";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


interface UserFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  srCode: string;
  department: string;
  course: string;
  encoding: number[];
}

interface InputInfoProps {
  formData: UserFormData;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  middleName: Yup.string(),
  lastName: Yup.string().required('Last Name is required'),
  suffix: Yup.string(),
  srCode: Yup.string()
    .required('SR-CODE is required')
    .test(
      'is-valid-format',
      'SR-CODE format: 24-12345, Employee ID format: P-12345',
      value => {
        return /^\d{2}-\d{5}$/.test(value) || /^P-\d{5}$/.test(value);
      }
    ),
  department: Yup.string().required('Department is required'),
  course: Yup.string().required('Course is required'),
});

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

const InputInfo: React.FC<InputInfoProps> = () => {
  const { localFormData, setLocalFormData, setIsFormValid } = useRegistrationStore();
  const { srCodeError } = useSrCodeStore();
  const { setSelectedDept } = useDeptStore();

  const handleSubmit = (values: UserFormData) => {
    setLocalFormData(values);
    setIsFormValid(true);
  };

  const handleDepartmentChange = (value: string, setFieldValue: (field: string, value: string | null) => void) => {
      setSelectedDept(value);
      setFieldValue('department', value);
      setFieldValue('course', '');
  };
  
  const handleCourseChange = (value: string, setFieldValue: (field: string, value: string | null) => void) => {
      setFieldValue('course', value);
  };

  const currentCourseOptions = localFormData.department
    ? courseOptions[localFormData.department]
    : [];

  return (
    <Formik
      initialValues={localFormData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="w-full flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-tc font-poppins md:text-5xl lg:mt-2">Registration</h1>
          </div>

          <div className="flex flex-col w-full items-center mt-8 mx-12 
          md:mx-0 md:space-y-4 lg:flex-row lg:space-x-20 lg:w-screen lg:px-40 lg:mt-12">
            {/* column 1 */}
            <div className="space-y-3 flex flex-col justify-center items-center w-full lg:space-y-4">
              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
                md:py-3 md:text-lg"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1 lg:text-left w-full lg:pl-3" />

              <Field
                type="text"
                name="middleName"
                placeholder="Middle Name"
                className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
                md:py-3 md:text-lg"
              />
              <ErrorMessage name="middleName" component="div" className="text-red-500 text-sm mt-1 lg:text-left w-full lg:pl-3" />

              <Field
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
                md:py-3 md:text-lg"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1 lg:text-left w-full lg:pl-3" />

              <Field
                type="text"
                name="suffix"
                placeholder="Suffix - e.g. Jr. (optional)"
                className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
                md:py-3 md:text-lg"
              />
              <ErrorMessage name="suffix" component="div" className="text-red-500 text-sm mt-1 lg:text-left w-full lg:pl-3" />
            </div>

            {/* column 2 */}
            <div className="space-y-3 flex flex-col justify-center items-center w-full lg:space-y-4 mt-3 lg:mt-0">
              <Field
                type="text"
                name="srCode"
                placeholder="SR-CODE"
                className={`w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
                  md:py-3 md:text-lg
                  ${srCodeError ? "border-red-500" : ""}`}
              />
              <ErrorMessage name="srCode" component="div" className="text-red-500 text-sm mt-1 lg:text-left w-full lg:pl-3" />

              {/* Dropdown for Department */}
              <Dropdown
                options={departmentOptions}
                value={localFormData.department}
                onChange={(value) => handleDepartmentChange(value, setFieldValue)}
                placeholder="Select College"
              />

              {/* Dropdown for Course */}
              <Dropdown
                options={currentCourseOptions}
                value={localFormData.course}
                onChange={(value) => handleCourseChange(value, setFieldValue)}
                placeholder="Select Course"
                disabled={!localFormData.department}
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