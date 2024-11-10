import React, {useState} from 'react';
import { Formik, Field, ErrorMessage, FormikValues, FormikHelpers } from 'formik';
import * as Yup from 'yup';

const userCodeRegex = /^(2\*-\*\*\*\*\*|P \*\*\*\*\*)$/;
const srCodeRegex = /^(2\*-\*\*\*\*\*)/;
// const employeeCodeRegex = /^(P \*\*\*\*\*)/;

const validationSchema = Yup.object().shape({
	firstName: Yup.string().required('First Name is required'),
	middleName: Yup.string(),
	lastName: Yup.string().required('Last Name is required'),
	suffix:  Yup.string(),
	userCode: Yup.string()
	.required('SR-CODE/Employee Number is required')
	.matches(userCodeRegex, 'Example format: "20-12345" or "P 12345"')
});

interface FormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
	userCode: string;
	department?: string;
	program?: string;
}

const Form: React.FC = () => {
	const [showFields, setShowFields] = useState(false);

  const initialValues: FormValues = {
		firstName: '',
		middleName: '',
		lastName: '',
		suffix: '',
		userCode: '',
		department: '',
		program: ''
  };
  
	const handleSubmit = (
		values: FormikValues,
		{ setSubmitting }: FormikHelpers<FormValues>
		) => {
			setTimeout(() => {
				console.log(values);
				setSubmitting(false);
			}, 1000);
		};

		const handleUserCodeChange = (e: React.ChangeEvent<HTMLInputElement>, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
			const value = e.target.value;
			handleChange(e);
			if (srCodeRegex.test(value)) {
				setShowFields(true);
			} else {
				setShowFields(false);
			}
		};

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
				{({ handleChange }) => (
					<form>
					<div className="flex flex-col space-y-3">
						<label htmlFor="firstName">
							<Field type="text" name="firstName" placeholder="First Name"
							className=""/>
							<ErrorMessage name="firstName" component="div" className="text-red-600 text-sm mt-1" />
						</label>

						<label htmlFor="middleName">
							<Field type="text" name="middleName" placeholder="Middle Name" />		
							<ErrorMessage name="middleName" component="div" className="text-red-600 text-sm mt-1" />
						</label>

						<label htmlFor="lastName">
							<Field type="text" name="lastName" placeholder="Last Name" />		
							<ErrorMessage name="lastName" component="div" className="text-red-600 text-sm mt-1" />
						</label>

						<label htmlFor="suffix">
							<Field type="text" name="suffix" placeholder='Suffix (e.g. "Jr.")' />		
							<ErrorMessage name="suffix" component="div" className="text-red-600 text-sm mt-1" />
						</label>

						<label htmlFor="userCode">
							<Field type="text" name="userCode" placeholder="SR-CODE/Employe Code"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUserCodeChange(e, handleChange)} />		
							<ErrorMessage name="userCode" component="div" className="text-red-600 text-sm mt-1" />
						</label>

						{showFields && (
							<>
								<label htmlFor="department">
									<Field type="text" name="department" placeholder="Department" />
									<ErrorMessage name="department" component="div" className="text-red-600 text-sm mt-1" />
								</label>

								<label htmlFor="program">
									<Field type="text" name="program" placeholder="Program" />
									<ErrorMessage name="program" component="div" className="text-red-600 text-sm mt-1" />
								</label>
							</>
						)}

					</div>
				</form>
				)
				} 

      </Formik>
    </>
  );
};

export default Form;