import { Formik, Form, ErrorMessage, Field } from "formik";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { AccountsResponse } from "@/types/accounts.type";

interface CreateUserModalProps {
  onClose: () => void;
  onSubmit: (newUser: AccountsResponse) => Promise<void>;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required").min(3),
  password: Yup.string().required("Password is required").min(8),
  role: Yup.string().required("Role is required").oneOf(['librarian', 'admin'])
});

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {username: string, password: string, role: string}) => {
    const newUser: AccountsResponse = {
      username: values.username,
      password: values.password,
      role: values.role,
      date_created: new Date().toISOString() // Adjust if needed
    };

    setIsLoading(true);
    try {
      await onSubmit(newUser); // Call the parent handler with the new user data
      setIsLoading(false);
      toast.success("User created successfully!", { position: "top-center" });
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to create user", { position: "top-center" });
      console.error(error);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <ToastContainer />
      <div className="bg-white rounded-lg p-6 px-8 space-y-8 flex flex-col drop-shadow-md">
        <div className="flex space-x-0">
          <div className="flex items-center justify-start w-64">
            <h1 className="text-2xl">Create User</h1>
          </div>
          <div className="flex items-center justify-end w-14">
            <button onClick={onClose} className="w-8 font-poppins rounded-sm p-1 hover:opacity-70 active:opacity-50 transition duration-200">
              <img src="/close-icon.svg" alt="" />
            </button>
          </div>
        </div>
        <div>
          <Formik
            initialValues={{ username: "", password: "", role: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <Form className="space-y-3 flex flex-col justify-center items-center">
              <div className="w-full flex items-center justify-center">
                <Field as="select" name="role" placeholder="Role" required className="p-2 px-[4.2em] py-3 bg-sf placeholder:text-sm outline-none rounded-lg text-md text-accent transition-all duration-300 tracking-wide">
                  <option value="" disabled>Select Role</option>
                  <option value="librarian">Librarian</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="error text-primary text-sm" />
              </div>
              <div>
                <Field type="text" name="username" autoComplete="off" placeholder="Username" required className="p-2 px-6 py-3 bg-sf placeholder:text-gray-500 placeholder:text-sm outline-none rounded-lg text-md text-accent focus:ring-1 focus:ring-accent transition-all duration-100 tracking-wide" />
                <ErrorMessage name="username" component="div" className="error text-primary text-sm" />
              </div>
              <div>
                <Field type="password" name="password" autoComplete="off" placeholder="Password" required className="p-2 px-6 py-3 bg-sf placeholder:text-gray-500 placeholder:text-sm outline-none rounded-lg text-md text-accent focus:ring-1 focus:ring-accent transition-all duration-100 tracking-wide" />
                <ErrorMessage name="password" component="div" className="error text-primary text-sm" />
              </div>
              <div className="w-full flex items-center justify-center">
                <button type="submit" className="w-1/3 font-poppins font-light tracking-wider text-sm text-white bg-accent border-2 border-bg rounded-md p-2 drop-shadow-md hover:ring-2 hover:ring-slate-600 transition-colors duration-300 active:opacity-80" disabled={isLoading}>
                  {isLoading ? <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-white border-t-transparent mt-1"></div> : "Submit"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
