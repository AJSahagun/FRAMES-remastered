// import '@testing-library/jest-dom';
// import { render, screen, fireEvent } from '@testing-library/react';
// import App from './App';

// // Mock the CSS import
// jest.mock('./App.css', () => ({}));

// describe('App', () => {
//   test('renders Vite and React logos', () => {
//     render(<App />);
//     const viteLogo = screen.getByAltText('Vite logo');
//     const reactLogo = screen.getByAltText('React logo');
//     expect(viteLogo).toBeInTheDocument();
//     expect(reactLogo).toBeInTheDocument();
//     expect(viteLogo.tagName).toBe('IMG');
//     expect(reactLogo.tagName).toBe('IMG');
//   });

//   test('renders header text', () => {
//     render(<App />);
//     expect(screen.getByText('Vite + React')).toBeInTheDocument();
//   });

//   test('renders count button with initial count of 0', () => {
//     render(<App />);
//     const button = screen.getByRole('button');
//     expect(button).toHaveTextContent('count is 0');
//   });

//   test('increases count when button is clicked', () => {
//     render(<App />);
//     const button = screen.getByRole('button');
//     fireEvent.click(button);
//     expect(button).toHaveTextContent('count is 1');
//   });

//   test('renders HMR instruction text', () => {
//     render(<App />);
//     expect(screen.getByText(/Edit/i)).toBeInTheDocument();
//     expect(screen.getByText(/src\/App\.tsx/i)).toBeInTheDocument();
//     expect(screen.getByText(/and save to test HMR/i)).toBeInTheDocument();
//   });

//   test('renders "read the docs" text', () => {
//     render(<App />);
//     expect(screen.getByText(/Click on the Vite and React logos to learn more/i)).toBeInTheDocument();
//   });

//   test('Vite and React links have correct hrefs', () => {
//     render(<App />);
//     const viteLink = screen.getByRole('link', { name: /vite logo/i });
//     const reactLink = screen.getByRole('link', { name: /react logo/i });
//     expect(viteLink).toHaveAttribute('href', 'https://vitejs.dev');
//     expect(reactLink).toHaveAttribute('href', 'https://react.dev');
//   });
// });