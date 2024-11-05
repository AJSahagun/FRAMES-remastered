// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import Dashboard from './Dashboard';  
// import userEvent from '@testing-library/user-event';

// describe('Dashboard Page', () => {
//   test('renders Dashboard with title and occupant count', () => {
//     render(<Dashboard />);

//     expect(screen.getByText('Dashboard')).toBeInTheDocument();

//     expect(screen.getByText(/Occupants/i)).toBeInTheDocument();
//   });

//   test('renders current date and time', () => {
//     render(<Dashboard />);

//     expect(screen.getByText(/\d{2}:\d{2} (AM|PM)/)).toBeInTheDocument();
//     expect(screen.getByText(/Tuesday, 28 Feb/i)).toBeInTheDocument(); 
//   });

//   test('renders check-in table with data', () => {
//     render(<Dashboard />);

//     expect(screen.getByText('Date/Time')).toBeInTheDocument();
//     expect(screen.getByText('Name')).toBeInTheDocument();
//     expect(screen.getByText('Program')).toBeInTheDocument();

//     expect(screen.getByText('MinJong Winter Kim')).toBeInTheDocument();
//     expect(screen.getByText('YoonYeon Lee')).toBeInTheDocument();
//   });

//   test('renders sidebar navigation links', () => {
//     render(<Dashboard />);

//     expect(screen.getByText('Dashboard')).toBeInTheDocument();
//     expect(screen.getByText('Graphics and Charts')).toBeInTheDocument();
//     expect(screen.getByText('Visitor History')).toBeInTheDocument();
//     expect(screen.getByText('Library Schedule')).toBeInTheDocument();
//   });

//   test('Logout button is displayed and clickable', () => {
//     render(<Dashboard />);

//     const logoutButton = screen.getByText('Logout');
//     expect(logoutButton).toBeInTheDocument();

//     userEvent.click(logoutButton);

//   });
// });
