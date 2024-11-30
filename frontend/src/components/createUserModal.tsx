import { Formik, Form, ErrorMessage, Field } from "formik";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
interface CreateUserModalProps {
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {username:string, password:string}) => {
    console.log(values);
    setIsLoading(true);
    try {
      // Simulate a function call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Handle successful function call
      setIsLoading(false);
      toast.success("User created successfully!", { position: "top-center" });
    } catch (error) {
      // Handle error
      setIsLoading(false);
      console.error(error);
    }
  }

  return(
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
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
              className="w-8 border-2 border-black/50  font-poppins rounded-sm p-1 hover:bg-gray-300 active:bg-gray-700 transition-all duration-150"
            > 
            <img src="/close-icon.svg" alt="" />
            </button>
          </div>
        </div>
        {/* body */}
        <div>
          <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={handleSubmit}>
            <Form className="space-y-3 flex flex-col justify-center items-center">
              <div>
                <Field 
                type="text"
                name="username"
                autoComplete="off"
                placeholder="Username"
                className="p-2 px-6 py-3 bg-sf placeholder:text-gray-500 placeholder:text-sm outline-none rounded-lg text-md text-accent focus:ring-1 focus:ring-accent transition-all duration-100 tracking-wide">
                </Field>
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error text-primary text-sm"
                />
              </div>
              <div>
                <Field 
                type="text"
                name="password"
                autoComplete="off"
                placeholder="Password"
                className="p-2 px-6 py-3 bg-sf placeholder:text-gray-500 placeholder:text-sm outline-none rounded-lg text-md text-accent focus:ring-1 focus:ring-accent transition-all duration-100 tracking-wide">
                </Field>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error text-primary text-sm"
                />
              </div>
              <div className="w-full flex items-center justify-center">
                <button className="w-1/3 font-poppins font-light tracking-wider text-sm text-white bg-accent border-2 border-bg rounded-md p-2 drop-shadow-md hover:ring-2 hover:ring-slate-600 transition-colors duration-300 active:opacity-80"
                disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-white border-t-transparent mt-1"></div>
                ) : (
                  'Submit'
                )}
                </button>
              </div>
            </Form>

          </Formik>
        </div>
      </div>
    </div>
  )

}

export default CreateUserModal;