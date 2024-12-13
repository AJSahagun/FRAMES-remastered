import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	// TODO: format, min & max length
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginForm() {
	const handleSubmit = async(values: { username: string; password: string }) => {
		console.log('Form values:', values);
		await new Promise((resolve) => setTimeout(resolve, 2000));
  };

	return(
		<>
		<Formik
		initialValues={{ username: '', password: '' }}
		validationSchema={validationSchema}
		onSubmit={handleSubmit}
		>
		{({ isSubmitting }) => (
			<Form>
				<div className="space-y-4">
					<div className=" font-noto_sans">
						<Field type="text" name="username" placeholder="Username"
						className="w-7/12 p-2 px-4 py-3 bg-tcf placeholder:text-ptcf  outline-none rounded-2xl text-md text-tc focus:ring-1 focus:ring-tc transition-all duration-200" />
						<ErrorMessage name="username" component="div" className="error text-primary text-sm" />
					</div>
					<div>
						<Field type="password" name="password" placeholder="Password"
						className="w-7/12 p-2 px-4 py-3 bg-tcf placeholder:text-ptcf  outline-none rounded-2xl text-md text-tc focus:ring-1 focus:ring-tc transition-all duration-200" />
						<ErrorMessage name="password" component="div" className="error text-primary text-sm" />
					</div>
				</div>

				<div className="flex mt-8 font-poppins font-semibold tracking-wider">
					{/* // TODO: add logic to button after submission; where to pass? */}

					<button type="submit" disabled={isSubmitting}
					className={`w-7/12 text-center bg-primary hover:bg-btnHover text-background py-3 rounded-xl font-poppins font-extralight drop-shadow-lg transition-all shadow-[3px_3px_0px_#351311] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] 
					${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} 
					>
						SIGN IN
					</button>
				</div>

				{/* <div className="mt-4 w-3/5 flex justify-center">
					<a href="#" className="font-noto_sans text-tc text-xs hover:text-btnBg">Forgot password?</a>
				</div> */}

			</Form>
		)}
		</Formik>

		</>
	);
};