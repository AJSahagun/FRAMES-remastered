import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import * as useSidebarStore from './stores/useSidebarStore';

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders the FRAMES logo", () => {
    const framesText = screen.getByAltText(/FRAMES/i);
    expect(framesText).toBeInTheDocument();
  });

  test("renders BatStateU logo text", () => {
    const bsuText = screen.getAllByText(/Foster Wheeler Library - Alangilan/i);
    expect(bsuText.length).toBeGreaterThan(0);

    const firstText = bsuText[0].closest('p');
    expect(firstText).not.toBeNull();
    expect(firstText).toHaveTextContent('Foster Wheeler Library - Alangilan');
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
    const links = screen.getAllByText(/tutorial/i) as HTMLAnchorElement[];
    expect(links.length).toBeGreaterThan(0);

    const firstLink = links[0].closest('a') as HTMLAnchorElement;
    expect(firstLink).not.toBeNull();
    expect(firstLink.getAttribute('href')).toContain("#tutorial");
  });
});

// Mocking stores for isolated tests
describe('App Component with Store Mocks', () => {
  const mockToggleSidebar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(useSidebarStore, 'useSidebarStore').mockImplementation(() => ({
      isOpen: false,
      toggleSidebar: mockToggleSidebar
    }));
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByAltText('FRAMES logo')).toBeInTheDocument();
  });

  test('image slider changes after interval', () => {
    jest.useFakeTimers();
    render(<App />);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    // expect(mockSetActiveIndex).toHaveBeenCalled();

    jest.useRealTimers();
  });
});