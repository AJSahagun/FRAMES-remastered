// InputInfo.tsx
import React, { useEffect, useCallback } from "react";
import { useRegistrationStore } from "./stores/useRegistrationStore";
import { useSrCodeStore } from "./stores/srCodeStore";
import { useSelectedDeptStore } from "./stores/selectedDeptStore"; 

interface UserFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  srCode: string;
  department: string;
  course: string; 
}

interface InputInfoProps {
  onValidate: (isValid: boolean, data?: UserFormData) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InputInfo: React.FC<InputInfoProps> = ({ onValidate }) => {
  const { localFormData, setLocalFormData, setIsFormValid } = useRegistrationStore();
  const { srCodeError, setSrCodeError } = useSrCodeStore();
  const { selectedDept, setSelectedDept } = useSelectedDeptStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const renderCourses = () => {
    const courses: { [key: string]: { value: string; label: string }[] } = {
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

    return courses[selectedDept]?.map((course) => (
      <option key={course.value} value={course.value}>
        {course.label}
      </option>
    ));
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <div className="text-center">
        <h1 className="text-tc font-poppins">Registration</h1>
      </div>

      <div className="mt-8 space-y-3 mx-12">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          required
          value={localFormData.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="middleName"
          placeholder="Middle Name"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          required
          value={localFormData.middleName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          required
          value={localFormData.lastName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="suffix"
          placeholder="Suffix - e.g. Jr. (optional)"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          value={localFormData.suffix}
          onChange={handleInputChange}
        />
        <div className="flex flex-col">
          <div className="mt-6 mb-1 opacity-50 text-sm ml-1">
            Please follow the format <span className="font-semibold">24-12345</span>
          </div>
          <input
            type="text"
            name="srCode"
            placeholder="SR-CODE"
            className={`w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary ${
              srCodeError ? "border-red-500" : ""
            }`}
            required
            value={localFormData.srCode}
            onChange={handleInputChange}
            onBlur={(e) => validateSrCode(e.target.value)}
          />
          {srCodeError && <p className="text-red-500 text-sm mt-1">{srCodeError}</p>}
        </div>
        <select
          name="department"
          className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
          required
          value={localFormData.department}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setLocalFormData({ department: e.target.value, course: "" });
          }}
        >
          <option value="" disabled hidden>
            Select College
          </option>
          <option value="CAFAD">College of Architecture, Fine Arts & Design</option>
          <option value="CET">College of Engineering Technology</option>
          <option value="CICS">College of Informatics and Computing Sciences</option>
          <option value="COE">College of Engineering</option>
        </select>
        <select
          name="course"
          className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
          required
          disabled={!localFormData.department}
          value={localFormData.course}
          onChange={handleInputChange}
        >
          <option value="" disabled hidden>
            Select Course
          </option>
          {renderCourses()}
        </select>
      </div>
    </form>
  );
};

export default React.memo(InputInfo);
