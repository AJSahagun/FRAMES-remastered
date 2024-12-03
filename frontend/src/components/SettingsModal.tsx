import { toast, ToastContainer} from 'react-toastify';

interface SettingsModalProps {
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
	// const handleSubmit = async () => {

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

	return(
    <div className="absolute max-h-dvh inset-0 bg-black/20 flex items-center justify-center z-50">
      <ToastContainer/>
      <div className="bg-white rounded-lg p-6 px-8 space-y-8 flex flex-col drop-shadow-md">
        {/* header */}
        <div className="flex space-x-0">
          <div className="flex items-center justify-start w-64">
            <h1 className="text-2xl">Create User</h1>
          </div>
          <div className="flex items-center justify-end w-14">
            <button 
              onClick={onClose} 
              className="w-8  font-poppins rounded-sm p-1 hover:opacity-70 active:opacity-50 transition duration-200"
            > 
            <img src="/close-icon.svg" alt="" />
            </button>
          </div>
        </div>
        {/* body */}

      </div>
    </div>
  )
};


export default SettingsModal;