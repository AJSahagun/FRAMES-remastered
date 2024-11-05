import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import this to use the toBeInTheDocument matcher
import App from './App';
import './index.css'; 

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders the FRAMES logo", () => {
    const framesText = screen.getByText(/FRAMES/i);
    expect(framesText).toBeInTheDocument();
  });

  test("renders BatStateU logo text", () => {
    const bsuText = screen.getByText(/Foster Wheeler Library - Alangilan/i);
    expect(bsuText).toBeInTheDocument();
  });

  test("renders main tutorial text", () => {
    const tutorialText = screen.getByText(/Access the Campus Library with FRAMES/i);
    expect(tutorialText).toBeInTheDocument();
  });

  test("renders description about the library system", () => {
    const descriptionText = screen.getByText(/Face Recognition Access Monitoring Enhanced System/i);
    expect(descriptionText).toBeInTheDocument();
  });

  test("renders the REGISTER NOW button", () => {
    const registerButton = screen.getByRole('button', { name: /REGISTER NOW/i });
    expect(registerButton).toBeInTheDocument();
  });

  test("renders the Learn More button", () => {
    const learnMoreButton = screen.getByRole('button', { name: /Learn More/i });
    expect(learnMoreButton).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/About us/i)).toBeInTheDocument();
  });
});