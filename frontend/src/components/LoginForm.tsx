import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../services/auth.service";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required").min(3),
  password: Yup.string().required("Password is required").min(8),
});

export default function LoginForm() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await login(values);
      
      toast.success("Login Successful");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login Failed:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <ToastContainer />
          <div className="w-full sm:w-[23rem] lg:w-full flex flex-col space-y-4 items-center">
            <div className="font-noto_sans xl:w-3/5 flex flex-col">
              <Field
                type="text"
                name="username"
                autoComplete="off"
                placeholder="Username"
                className="p-2 px-6 py-3 bg-tcf placeholder:text-ptcf outline-none rounded-xl lg:rounded-2xl text-md text-tc focus:ring-1 focus:ring-tc transition-all duration-200 tracking-wide"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error text-primary text-sm"
              />
            </div>

            <div className="font-noto_sans xl:w-3/5 flex flex-col">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="p-2 px-6 py-3 bg-tcf placeholder:text-ptcf outline-none rounded-xl lg:rounded-2xl text-md text-tc focus:ring-1 focus:ring-tc transition-all duration-200 tracking-wide"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error text-primary text-sm"
              />
            </div>
          </div>

          <div className="w-full flex mt-8 font-poppins font-semibold tracking-wider items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-3/4 lg:w-2/5 text-center bg-primary hover:bg-btnHover text-background py-3 rounded-xl font-poppins font-extralight drop-shadow-lg transition-all shadow-[3px_3px_0px_#351311] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              SIGN IN
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}