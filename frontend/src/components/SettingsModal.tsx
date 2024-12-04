import { toast, ToastContainer} from 'react-toastify';
import { useState } from 'react';
import ColorPickerButton from '@/components/ColorPickerButton';

interface SettingsModalProps {
	onClose: () => void;
}

const initialDepartments = [
	{ name: 'CAFAD', color: '#8BA757' },
  { name: 'CET', color: '#FFAE4C' },
	{ name: 'CICS', color: '#201693' },
	{ name: 'CoE', color: '#C30D26' },
	{ name: 'Others', color: '#7C7070' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
	const [deptColorsPage, setDeptColorsPage] = useState(true);
	const [occupantLimitPage, setOccupantLimitPage] = useState(false);
	const [departments, setDepartments] = useState(initialDepartments);
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const [enableEditOccupant, setEnableEditOccupant] = useState(false);
	const [occupantLimit, setOccupantLimit] = useState(0);

	const activateDeptColors = () => {
		setOccupantLimitPage(false);
		setDeptColorsPage(true);
		setActiveButton('deptColors');
	}

	const activateOccupantLimit = () => {
		setDeptColorsPage(false);
		setOccupantLimitPage(true);
		setActiveButton('occupantLimit');
	}
	
  const handleOccupantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setOccupantLimit(value);
    }
  };

	const handleSubmit = async () => {
		if(setEnableEditOccupant) {
			setEnableEditOccupant(false);
		}

		try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
			// TODO (integration): add logic to save changes
  
      toast.success("Settings are updated!", { position: "top-center" });
    } catch (error) {
      // Handle error
      toast.error("Failed to save changes.", { position: "top-center" });
      console.error(error);
    }

	};

  // const handleOccupantSubmit = () => {
  //   // TODO (integration): add logic to save changes
  //   console.log('Occupant limit saved:', occupantLimit);
  //   setEnableEditOccupant(false);
  // };

	// const handleDeptColorsSubmit = async () => {
	// 	// TODO (integration): add logic to save changes
  //   try {
  //     // Simulate a function call
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     // Handle successful function call
  //     toast.success("Settings are updated!", { position: "top-center" });
  //   } catch (error) {
  //     // Handle error
  //     toast.error("Failed to save changes.", { position: "top-center" });
  //     console.error(error);
  //   }
	// }

	const addDepartment = () => {
    setDepartments([...departments, { name: '', color: '#ffffff' }]);
  };

	const handleColorChange = (index: number, color: string) => {
    const newDepartments = [...departments];
    newDepartments[index].color = color;
    setDepartments(newDepartments);
  };


	return(
    <div className="absolute  inset-0 bg-black/20 flex items-center justify-center z-50">
      <ToastContainer/>
      <div className="bg-white rounded-lg p-6 px-8 w-1/2 h-[33em] flex flex-col drop-shadow-md">
        {/* header */}
        <div className="flex space-x-0 w-full">
          <div className="flex items-center justify-start w-64">
            <h1 className="text-3xl text-primary font-poppins">Settings</h1>
          </div>
          <div className="flex items-start justify-end w-full">
            <button 
              onClick={onClose} 
              className="w-8  font-poppins rounded-sm p-1 hover:opacity-70 active:opacity-50 transition duration-200"
            > 
            <img src="/close-icon.svg" alt="" />
            </button>
          </div>
        </div>
        {/* body */}
				<div className="flex flex-row justify-center space-x-6 font-poppins text-tc mt-0">
					<div>
						<button className={`p-2 rounded-md ${activeButton === 'deptColors' ? 'bg-tcf  font-semibold' : 'hover:bg-tcf'}`}
						onClick={activateDeptColors}
							> Department Colors
						</button>
					</div>
					<div>
						<button className={`p-2 rounded-md ${activeButton === 'occupantLimit' ? 'bg-tcf font-semibold' : 'hover:bg-tcf'}`}
						onClick={activateOccupantLimit}
							> Occupant Limit
						</button>
					</div>

				</div>

				<hr className="mt-2"/>
				
				{/* Department Colors */}
				{deptColorsPage && (
					<div className="font-poppins text-tc flex flex-col items-center justify-center">
						<table className="w-1/2">
							<tbody className="bg-white">
								{departments.map((dept, index) => (
									<tr key={index}>
										<td className="px-6 py-4 whitespace-nowrap text-md font-semibold text-accent">
											<p>{dept.name}</p>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-tc font-noto_sans font-semibold">
											<ColorPickerButton
												initialValue={dept.color}
												onChange={(color:string) => handleColorChange(index, color)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="w-full flex flex-row justify-end space-x-3">
							<button
								onClick={addDepartment}
								title="Add a new department"
								className="mt-4 px-4 py-2 border-2 border-btnBg text-btnBg bg-stone-100 hover:brightness-90 rounded-md"
							>
								Add
							</button>
							<button
								onClick={handleSubmit}
								title="Save changes"
								className="mt-4 px-4 py-2 bg-btnBg text-white hover:opacity-80 rounded-md"
							>
								Save
							</button>
						</div>
					</div>
				)}

				{/* Occupant Limit */}
				{occupantLimitPage && (
					<div className="font-poppins text-tc flex flex-col items-start justify-center">
						<div className="flex w-full p-2 px-4 space-x-6 mt-4">
							<div className="flex w-1/2 justify-end text-lg font-semibold">
								<p>Limit</p>
							</div>
							<div className="flex w-1/2 ">
								<input 
								type="text"
								value={occupantLimit}
								disabled={!enableEditOccupant}
								onChange={handleOccupantChange}
								className={`${enableEditOccupant ? 'border border-accent' : 'opacity-60'} flex w-1/4 text-center text-lg bg-stone-100 border rounded-md`} 
								/>
							</div>
						</div>
						
						{/* buttons */}
						<div className="w-full flex flex-row justify-end space-x-3">
							<button
								onClick={() => setEnableEditOccupant(true)}
								
								className="mt-4 px-4 py-2 border-2 border-btnBg text-btnBg bg-stone-100 hover:brightness-90 rounded-md"
							>
								Edit
							</button>
							<button
								onClick={handleSubmit}
								title="Save changes"
								className="mt-4 px-4 py-2 bg-btnBg text-white hover:opacity-80 rounded-md"
							>
								Save
							</button>
						</div>
					</div>
				)}


      </div>
    </div>
  )
};


export default SettingsModal;