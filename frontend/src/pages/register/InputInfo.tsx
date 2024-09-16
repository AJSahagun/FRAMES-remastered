import React, { useState, useEffect } from "react";

interface Course {
  value: string;
  label: string;
}

interface Courses {
  [key: string]: Course[];
}

export interface UserFormData {
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

export default function InputInfo({ onValidate }: InputInfoProps) {
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    srCode: "",
    department: "",
    course: "",
  });
  const [srCodeError, setSrCodeError] = useState<string>("");

  const courses: Courses = {
    CAFAD: [
      { value: "BSArch", label: "BS Architecture" },
      { value: "BFA", label: "Bachelor of Fine Arts and Design" },
      { value: "BSID", label: "BS Interior Design" },
    ],
    COE: [
      { value: "BSAeroEng", label: "BS Aerospace Engineering" },
      { value: "BSAutoEng", label: "BS Automotive Engineering" },
      { value: "BSBioMedEng", label: "BS Biomedical Engineering" },
      { value: "BSChemEng", label: "BS Chemical Engineering" },
      { value: "BSCivEng", label: "BS Civil Engineering" },
      { value: "BSCpE", label: "BS Computer Engineering" },
      { value: "BSEE", label: "BS Electrical Engineering" },
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "srCode") {
      validateSrCode(value);
    }
  };

  useEffect(() => {
    const isValid = 
      formData.firstName.trim() !== "" &&
      formData.middleName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      /^\d{2}-\d{5}$/.test(formData.srCode) &&
      formData.department !== "" &&
      formData.course !== "";
    
    onValidate(isValid, formData);
  }, [formData, onValidate]);

  const validateSrCode = (value: string) => {
    const srCodeRegex = /^\d{2}-\d{5}$/;
    if (!srCodeRegex.test(value)) {
      setSrCodeError("SR-CODE must be in the format 24-12345");
    } else {
      setSrCodeError("");
    }
  };

  const renderCourses = () => {
    if (!selectedDept) return null;
    return courses[selectedDept]?.map((course: Course) => (
      <option key={course.value} value={course.value}>
        {course.label}
      </option>
    ));
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <div className="mt-8 space-y-3">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          required
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="middleName"
          placeholder="Middle Name"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          required
          value={formData.middleName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          required
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="suffix"
          placeholder="Suffix - e.g. Jr. (optional)"
          className="w-full px-6 py-2 rounded-lg bg-sf focus:outline-secondary"
          value={formData.suffix}
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
              srCodeError ? 'border-red-500' : ''
            }`}
            required
            value={formData.srCode}
            onChange={handleInputChange}
          />
          {srCodeError && (
            <p className="text-red-500 text-sm mt-1">{srCodeError}</p>
          )}
        </div>
        <select
          name="department"
          className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
          required
          value={formData.department}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setFormData(prev => ({ ...prev, department: e.target.value, course: "" }));
          }}
        >
          <option value="" disabled hidden>Select College</option>
          <option value="CAFAD">College of Architecture, Fine Arts & Design</option>
          <option value="CET">College of Engineering Technology</option>
          <option value="CICS">College of Informatics and Computing Sciences</option>
          <option value="COE">College of Engineering</option>
        </select>
        <select
          name="course"
          className="w-full px-6 py-3 rounded-lg bg-sf focus:outline-secondary"
          required
          disabled={!formData.department}
          value={formData.course}
          onChange={handleInputChange}
        >
          <option value="" disabled hidden>Select Course</option>
          {renderCourses()}
        </select>
      </div>
    </form>
  );
}