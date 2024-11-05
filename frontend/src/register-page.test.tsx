import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './pages/register/register-page'; // Importing the Register component
import '@testing-library/jest-dom/extend-expect';

describe('Registration Page Tests', () => {
  // Test that only letters are accepted in name fields
  test('should accept only letters in First Name, Middle Name, and Last Name fields', async () => {
    render(<Register />); // Rendering the Register component

    const firstNameInput = screen.getByPlaceholderText('First Name') as HTMLInputElement;
    const middleNameInput = screen.getByPlaceholderText('Middle Name') as HTMLInputElement;
    const lastNameInput = screen.getByPlaceholderText('Last Name') as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: 'John123' } });
    fireEvent.change(middleNameInput, { target: { value: 'Doe!' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith@' } });

    await waitFor(() => {
      expect(firstNameInput.value).toBe(''); // First name should reject non-letters
      expect(middleNameInput.value).toBe(''); // Middle name should reject non-letters
      expect(lastNameInput.value).toBe(''); // Last name should reject non-letters
    });
  });

  // Test that SR-Code follows specific format
  test('should accept SR-Code in the format 21-02831 with only numbers', async () => {
    render(<Register />); // Rendering the Register component

    const srCodeInput = screen.getByPlaceholderText('SR-CODE/Employee ID') as HTMLInputElement;
    fireEvent.change(srCodeInput, { target: { value: '21-02831' } });

    await waitFor(() => {
      expect(srCodeInput.value).toBe('21-02831'); // SR-Code should accept correct format
    });

    fireEvent.change(srCodeInput, { target: { value: 'A1-02831' } });
    await waitFor(() => {
      expect(srCodeInput.value).not.toBe('A1-02831'); // Reject incorrect format
    });
  });

  // Test if the College dropdown is present when SR-Code is in student format
  test('should display College dropdown when SR-Code is in the student format', async () => {
    render(<Register />); // Rendering the Register component

    const srCodeInput = screen.getByPlaceholderText('SR-CODE/Employee ID');
    fireEvent.change(srCodeInput, { target: { value: '21-02831' } });

    const collegeDropdown = await screen.findByPlaceholderText('Select College');
    expect(collegeDropdown).toBeInTheDocument();
  });

  // Test if the Course dropdown is present after College selection
  test('should display Course dropdown after selecting College', async () => {
    render(<Register />); // Rendering the Register component

    const srCodeInput = screen.getByPlaceholderText('SR-CODE/Employee ID');
    fireEvent.change(srCodeInput, { target: { value: '21-02831' } });

    const collegeDropdown = await screen.findByPlaceholderText('Select College');
    fireEvent.change(collegeDropdown, { target: { value: 'CAFAD' } });

    const courseDropdown = await screen.findByPlaceholderText('Select Program');
    expect(courseDropdown).toBeInTheDocument();
  });

  // Test if the Next button is present and behaves correctly
  test('should have Next button disabled when form is invalid and enabled when form is valid', async () => {
    render(<Register />); // Rendering the Register component

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled(); // Check if the button is enabled after valid input
    });
  });
});
