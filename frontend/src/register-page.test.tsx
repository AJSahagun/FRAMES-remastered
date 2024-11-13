import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './pages/register/register-page';
import '@testing-library/jest-dom/extend-expect';

describe('Registration Page Tests', () => {

  test('should accept only letters in First Name, Middle Name, and Last Name fields', async () => {
    render(<Register />);
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const middleNameInput = screen.getByPlaceholderText('Middle Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    fireEvent.change(firstNameInput, { target: { value: 'John123' } });
    fireEvent.change(middleNameInput, { target: { value: 'Doe!' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith@' } });
    await waitFor(() => {
      expect(firstNameInput.value).toBe('');
      expect(middleNameInput.value).toBe('');
      expect(lastNameInput.value).toBe('');
    });
  });

  test('should accept SR-Code in the format 21-02831 with only numbers', async () => {
    render(<Register />);
    const srCodeInput = screen.getByPlaceholderText('SR-CODE/Employee ID');
    fireEvent.change(srCodeInput, { target: { value: '21-02831' } });
    await waitFor(() => {
      expect(srCodeInput.value).toBe('21-02831');
    });
    fireEvent.change(srCodeInput, { target: { value: 'A1-02831' } });
    await waitFor(() => {
      expect(srCodeInput.value).not.toBe('A1-02831');
      expect(srCodeInput.value).toBe('21-02831');
    });
  });

  test('should display College dropdown when SR-Code is in the student format', async () => {
    render(<Register />);
    const srCodeInput = screen.getByPlaceholderText('SR-CODE/Employee ID');
    fireEvent.change(srCodeInput, { target: { value: '21-02831' } });
    const collegeDropdown = await screen.findByPlaceholderText('Select College');
    expect(collegeDropdown).toBeInTheDocument();
  });

  test('should display Course dropdown after selecting College', async () => {
    render(<Register />);
    const srCodeInput = screen.getByPlaceholderText('SR-CODE/Employee ID');
    fireEvent.change(srCodeInput, { target: { value: '21-02831' } });
    const collegeDropdown = await screen.findByPlaceholderText('Select College');
    fireEvent.change(collegeDropdown, { target: { value: 'CAFAD' } });
    const courseDropdown = await screen.findByPlaceholderText('Select Program');
    expect(courseDropdown).toBeInTheDocument();
  });

  test('should have Next button disabled when form is invalid and enabled when form is valid', async () => {
    render(<Register />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });
});
