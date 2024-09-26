// InputInfo.tsx
import React, { useEffect, useCallback } from "react";
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { useSrCodeStore } from "./stores/srCodeStore";
import { useDeptStore } from "./stores/useDeptStore"; 
import Dropdown from "../../components/Dropdown";

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

const InputInfo: React.FC<InputInfoProps> = () => {
  const { localFormData, setLocalFormData, setIsFormValid } = useRegistrationStore();
  const { srCodeError, setSrCodeError } = useSrCodeStore();
  const { setSelectedDept } = useDeptStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFormData({ [name]: value });
  };

  const validateSrCode = useCallback((code: string) => {
    if (!/^\d{2}-\d{5}$/.test(code)) {
      setSrCodeError("Please follow the SR-CODE format (24-12345)");
    } else {
      setSrCodeError("");
    }
  }, [setSrCodeError]);

  const validateForm = useCallback(() => {
    const isValid =
      Boolean(localFormData.firstName?.trim()) &&
      Boolean(localFormData.lastName?.trim()) &&
      Boolean(localFormData.srCode?.trim()) &&
      !srCodeError;
    return isValid;
  }, [localFormData.firstName, localFormData.lastName, localFormData.srCode, srCodeError]);

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [localFormData, validateForm, setIsFormValid]);

  const handleDepartmentChange = (value: string) => {
    setSelectedDept(value);
    setLocalFormData({ department: value, course: "" });
  };

  const handleCourseChange = (value: string) => {
    setLocalFormData({ course: value });
  };

  const currentCourseOptions = localFormData.department
    ? courseOptions[localFormData.department]
    : [];

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-tc font-poppins md:text-5xl lg:mt-2">Registration</h1>
      </div>

      <div className="flex flex-col w-full items-center mt-8 mx-12 
      md:mx-0 md:space-y-4 lg:flex-row lg:space-x-20 lg:w-screen lg:px-40 lg:mt-12">
        {/* column 1 */}
        <div className="space-y-3 flex flex-col justify-center items-center w-full lg:space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
            md:py-3 md:text-lg"
            required
            value={localFormData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
            md:py-3 md:text-lg"
            required
            value={localFormData.middleName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
            md:py-3 md:text-lg"
            required
            value={localFormData.lastName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="suffix"
            placeholder="Suffix - e.g. Jr. (optional)"
            className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
            md:py-3 md:text-lg"
            value={localFormData.suffix}
            onChange={handleInputChange}
          />
        </div>

        {/* column 2 */}
        <div className="space-y-3 flex flex-col justify-center items-center w-full lg:space-y-4 mt-3 lg:mt-0">
          {/* <div className="w-full mt-6 mb-1 opacity-50 text-sm ml-1 lg:text-left lg:-mb-2">
            Please follow the format <span className="font-semibold">24-12345</span>
          </div> */}
          <input
            type="text"
            name="srCode"
            placeholder="SR-CODE"
            className={`w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary
              md:py-3 md:text-lg
              ${srCodeError ? "border-red-500" : ""}`}
            required
            value={localFormData.srCode}
            onChange={handleInputChange}
            onBlur={(e) => validateSrCode(e.target.value)}
          />
          {srCodeError && <p className="text-red-500 text-sm mt-1 lg:text-left w-full lg:pl-3">{srCodeError}</p>}

          {/* Dropdown for Department */}
          <Dropdown
            options={departmentOptions}
            value={localFormData.department}
            onChange={handleDepartmentChange}
            placeholder="Select College"
          />

          {/* Dropdown for Course */}
          <Dropdown
            options={currentCourseOptions}
            value={localFormData.course}
            onChange={handleCourseChange}
            placeholder="Select Course"
            disabled={!localFormData.department}
          />
        </div>
      </div>
    </form>
  );
};

export default React.memo(InputInfo);