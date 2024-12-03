import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";

interface ColorPickerButtonProps {
  initialValue: string;
  onChange: (color: string) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  initialValue,
  onChange,
}) => {
  const [color, setColor] = useState(initialValue); // Initial color
  const [isPickerVisible, setPickerVisible] = useState(false);

  // Update local color state when the `initialValue` changes
  useEffect(() => {
    setColor(initialValue);
  }, [initialValue]);
  
  const togglePicker = () => setPickerVisible((prev) => !prev);

  const handleSubmit = async () => {
    setPickerVisible(false)
    handleColorChange(color);
    // TODO (integration): add logic to save color to backend
  }
  
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor); // Call parent handler to update color in the parent component
  };

  return (
    <div className="relative">
      {/* Button that shows color preview and hex code */}
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

      {/* Color Picker (conditionally rendered) */}
      {isPickerVisible && (
        <div className="absolute mt-2 z-10 bg-white shadow-lg p-4 rounded-lg">
          <HexColorPicker color={color} onChange={setColor} />
          <div className="flex justify-end">
            <button className="p-1 px-3 mt-2 bg-stone-200 rounded-md text-tc hover:bg-stone-300 active:opacity-70"
            onClick={handleSubmit}>
              Select
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;
