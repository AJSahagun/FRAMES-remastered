import React from "react";
import { UserFormData } from "./InputInfo"; // Import UserFormData type

interface CheckInfoProps {
  formData: UserFormData; // Expect formData of type UserFormData
}

const CheckInfo: React.FC<CheckInfoProps> = ({ formData }) => {
  return (
    <div>
      <h2>Check Your Information</h2>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default CheckInfo;
