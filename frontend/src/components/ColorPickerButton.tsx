import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";
import { RefreshCw, Check } from "lucide-react";

interface ColorPickerButtonProps {
  initialValue: string;
  onChange: (color: string) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  initialValue,
  onChange,
}) => {
  const [color, setColor] = useState(initialValue);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [manualInput, setManualInput] = useState(initialValue);

  useEffect(() => {
    setColor(initialValue);
    setManualInput(initialValue);
  }, [initialValue]);

  const togglePicker = () => setPickerVisible((prev) => !prev);

  const handleSubmit = () => {
    setPickerVisible(false);
    handleColorChange(color);
  };

  const handleColorChange = (newColor: string) => {
    const formattedColor = newColor.startsWith("#") ? newColor : `#${newColor}`;
    setColor(formattedColor);
    setManualInput(formattedColor);
    onChange(formattedColor);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setManualInput(inputValue);
  };

  const handleManualInputSubmit = () => {
    const hexColorRegex = /^#?([0-9A-Fa-f]{3}){1,2}$/;
    if (hexColorRegex.test(manualInput)) {
      const formattedColor = manualInput.startsWith("#")
        ? manualInput
        : `#${manualInput}`;
      handleColorChange(formattedColor);
    }
  };

  const handleReset = () => {
    handleColorChange(initialValue);
  };

  return (
    <div className="relative">
      {/* Button that shows color preview and hex code */}
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePicker}
          className="flex w-30 items-center space-x-2 border px-4 py-2 rounded-md bg-stone-100 hover:bg-gray-200 focus:outline-none font-noto_sans"
        >
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          ></span>
          <span>{color.toUpperCase()}</span>
        </button>
      </div>

      {/* Color Picker (conditionally rendered) */}
      {isPickerVisible && (
        <div className="absolute mt-2 z-10 bg-white shadow-lg p-4 rounded-lg w-64">
          <HexColorPicker color={color} onChange={setColor} />

          {/* Manual Hex Input */}
          <div className="flex mt-2 space-x-2">
            <input
              type="text"
              value={manualInput}
              onChange={handleManualInputChange}
              placeholder="Enter hex color"
              className="flex-grow border rounded-md px-2 py-1 w-24"
            />
            <button
              onClick={handleManualInputSubmit}
              className="bg-stone-200 p-1 rounded-md hover:bg-stone-300"
              title="Apply color"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-stone-200 hover:bg-stone-300 rounded-md"
              title="Reset to initial color"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="flex justify-end">
            <button
              className="p-1 px-3 mt-2 bg-stone-200 rounded-md text-tc hover:bg-stone-300 active:opacity-70"
              onClick={handleSubmit}
            >
              Select
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;
