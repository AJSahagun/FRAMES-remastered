import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLoginStore } from './useLoginStore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
  username: Yup.string().required('username is required').min(3).max(10).matches(/^[a-zA-Z0-9_]+$/, 'only letters, numbers, and underscores are allowed'),
  password: Yup.string().required('password is required').min(8).matches(/^[a-zA-Z0-9!@#$%^&*-_+=]+$/, 'only letters, numbers, and special characters (!@#$%^&*-_+=)'),
});

export default function LoginForm() {
	const { username, password, setUsername, setPassword, resetLoginForm } = useLoginStore();

	const handleSubmit = async (values: { username: string; password: string }) => {
		try {
			// Simulate API call for login
			console.log('Login Submitted:', values);
			
			// Example of API logic
			const response = await fakeLoginAPI(values);
			console.log('Login Successful:', response);

			// Redirect user to '/dashboard'
			window.location.href = '/dashboard';
			
			// Clear the form or navigate the user
			resetLoginForm();
		} catch (error) {
			console.error('Login Failed:', error);
			toast.error('Invalid username or password');
		}
	};
	
	const fakeLoginAPI = async (credentials: { username: string; password: string }) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (credentials.username === 'test' && credentials.password === '12345678') {
					resolve({ message: 'Login successful' });
				} else {
					reject(new Error('Invalid username or password'));
				}
			}, 1000);
		});
	};

	return(
		<>
		
		<Formik
		initialValues={{ username: '', password: '' }}
		validationSchema={validationSchema}
		onSubmit={handleSubmit}
		>
		{({ setFieldValue, isSubmitting }) => (
			<Form>
				<ToastContainer/>
				<div className="w-full sm:w-[23rem] lg:w-full flex flex-col space-y-4 items-center">
					<div className="font-noto_sans xl:w-3/5 flex flex-col">
						<Field type="text" name="username" placeholder="Username" id="username"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setUsername(e.target.value);
							setFieldValue('username', e.target.value); // Sync with Formik
						}}
						value={username}
						className="p-2 px-6 py-3 bg-tcf placeholder:text-ptcf  outline-none rounded-xl lg:rounded-2xl text-md text-tc focus:ring-1 focus:ring-tc transition-all duration-200 tracking-wide" />
						<ErrorMessage name="username" component="div" className="error text-primary text-sm" />
					</div>

					<div className="font-noto_sans xl:w-3/5 flex flex-col">
						<Field type="password" name="password" placeholder="Password"
						id="password"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setPassword(e.target.value);
							setFieldValue('password', e.target.value); // Sync with Formik
						}}
						value={password}
						className="p-2 px-6 py-3 bg-tcf placeholder:text-ptcf  outline-none rounded-xl lg:rounded-2xl text-md text-tc focus:ring-1 focus:ring-tc transition-all duration-200 tracking-wide" />
						<ErrorMessage name="password" component="div" className="error text-primary text-sm" />
					</div>
				</div>

				<div className="w-full flex mt-8 font-poppins font-semibold tracking-wider items-center justify-center">
					<button type="submit" disabled={isSubmitting}
					className="w-3/4 lg:w-2/5 text-center bg-primary hover:bg-btnHover text-background py-3 rounded-xl font-poppins font-extralight drop-shadow-lg transition-all shadow-[3px_3px_0px_#351311] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
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