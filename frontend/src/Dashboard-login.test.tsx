// import { render, screen } from '@testing-library/react';
// import Login from './Login'; 
// import './index.css';

// describe("Login Component", () => {
//   beforeEach(() => {
//     render(<Login />);
//   });

//   test("renders the FRAMES logo", () => {
//     const framesText = screen.getByText(/FRAMES/i);
//     expect(framesText).toBeInTheDocument();
//   });

//   test("renders the welcome message", () => {
//     const welcomeText = screen.getByText(/HELLO, WELCOME BACK/i);
//     expect(welcomeText).toBeInTheDocument();
//   });

//   test("renders the username input field", () => {
//     const usernameInput = screen.getByPlaceholderText(/Username/i);
//     expect(usernameInput).toBeInTheDocument();
//   });

//   test("renders the password input field", () => {
//     const passwordInput = screen.getByPlaceholderText(/Password/i);
//     expect(passwordInput).toBeInTheDocument();
//   });

//   test("renders the remember me checkbox", () => {
//     const rememberMeCheckbox = screen.getByLabelText(/Remember me/i);
//     expect(rememberMeCheckbox).toBeInTheDocument();
//   });

//   test("renders the SIGN IN button", () => {
//     const signInButton = screen.getByRole('button', { name: /SIGN IN/i });
//     expect(signInButton).toBeInTheDocument();
//   });

//   test("renders the forgot password link", () => {
//     const forgotPasswordLink = screen.getByText(/Forgot Password?/i);
//     expect(forgotPasswordLink).toBeInTheDocument();
//   });
// });
