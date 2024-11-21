// InputInfo.tsx
import React, { useEffect, useCallback } from "react";
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Dropdown from "../../components/Dropdown";
import { UserRegistrationData } from '../../types/user.types';
import { useFormStore, validationSchema, srCodeRegex } from "./stores/useFormStore";
import { departmentOptions, programOptions } from "../../types/deptandprog.types";

interface InputInfoProps {
  formData: UserRegistrationData;
  onNext: () => void;
}
interface DropdownOption {
  value: string;
  label: string;
}

const InputInfo: React.FC<InputInfoProps> = ({ onNext }) => {
  const {
    localFormData,
    setLocalFormData,
    selectedDept,
    setSelectedDept,
    selectedProgram: availableProgramOptions,
    setSelectedProgram,
    submitForm
  } = useRegistrationStore();
  const { isFormValid, validateForm } = useFormStore();

  const handleSubmit = (values: UserRegistrationData) => {
    setLocalFormData(values);
    validateForm(values);
    if (isFormValid) {
      submitForm();
      onNext();
    }
  };

  const handleDepartmentChange = (
    option: DropdownOption,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setSelectedDept(option.value);
    setFieldValue('department', option.value);
    setFieldValue('program', '');
    setSelectedProgram(programOptions[option.value] || []);
  };
  
  const handleProgramChange = (
    option: DropdownOption,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue('program', option.value);
  };

  return (
    <Formik
      initialValues={localFormData}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validate={(values) => {
        // Trigger form validation in store immediately
        validateForm(values);
        return {}; // Return empty object to avoid Formik validation warning
      }}
    >
      {({ setFieldValue, values }) => (
        <Form className="w-full flex flex-col relative items-center">
          <div className="text-center">
            <h1 className="text-tc font-poppins md:text-5xl lg:mt-2 lg:mb-10">Registration</h1>
          </div>

          <div className="w-full relative flex flex-col lg:flex-row lg:w-3/4 items-center justify-center mt-8 space-y-3 lg:space-x-2">
            <div className="space-y-3 mx-8 lg:w-1/2 justify-center items-center">
              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
                autoComplete="off"
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
              
              <Field
                type="text"
                name="middleName"
                placeholder="Middle Name"
                className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
                autoComplete="off"
              />
              <ErrorMessage name="middleName" component="div" className="text-red-500 text-sm" />
              
              <Field
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
                autoComplete="off"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              
              <Field
                type="text"
                name="suffix"
                placeholder="Suffix (e.g. Jr.)"
                className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
                autoComplete="off"
              />
              <ErrorMessage name="suffix" component="div" className="text-red-500 text-sm" />
              
              <Field
                type="text"
                name="userCode"
                placeholder="SR-CODE/Employee ID"
                className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
                autoComplete="off"
              />
              <ErrorMessage name="userCode" component="div" className="text-red-500 text-sm" />

              {values.userCode && srCodeRegex.test(values.userCode) && (
                <>
                  <Dropdown
                    options={departmentOptions}
                    value={values.department}
                    onChange={(option) => handleDepartmentChange(option, setFieldValue)}
                    placeholder="Select College"
                  />
                  <ErrorMessage name="department" component="div" className="text-red-500 text-sm" />

                  <Dropdown
                    options={availableProgramOptions}
                    value={values.program}
                    onChange={(option) => handleProgramChange(option, setFieldValue)}
                    placeholder="Select Program"
                    disabled={!selectedDept}
                  />
                  <ErrorMessage name="program" component="div" className="text-red-500 text-sm" />
                </>
              )}
            </div>
          </div>

          <button
            className={`font-poppins text-md text-background rounded-lg w-2/3 py-2 mt-10 shadow-md transition-all duration-500  ease-in-out lg:mt-20 lg:w-1/4 ${
              isFormValid
                ? "bg-btnBg hover:bg-gradient-to-br hover:from-accent hover:to-btnBg transform hover:scale-105"
                : "bg-btnBg opacity-50 cursor-not-allowed"
            }`}
            type="submit"
            disabled={!isFormValid}
          >
            Next
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(InputInfo);