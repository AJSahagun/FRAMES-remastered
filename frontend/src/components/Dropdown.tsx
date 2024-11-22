import { useState } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (option: DropdownOption) => void;
  placeholder: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => !disabled && setIsOpen(!isOpen);

  const selectOption = (option: DropdownOption) => {
    onChange(option); // Pass the entire option object to the parent
    setIsOpen(false); // Close dropdown after selection
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative inline-block w-full text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`w-full flex justify-between items-center px-6 py-2 rounded-lg bg-sf focus:outline-secondary
          md:py-3 md:text-lg 
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="text-gray-700">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="ml-2">&#9662;</span> {/* Dropdown arrow */}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg">
          <ul className="max-h-60 overflow-auto rounded-lg text-gray-800">
            {options.map((option) => (
              <li
                key={option.value}
                className="cursor-pointer select-none py-2 px-4 hover:bg-gray-200"
                onClick={() => selectOption(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
