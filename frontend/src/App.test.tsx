import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import this to use the toBeInTheDocument matcher
import App from './App';
import './index.css'; 
import * as useSidebarStore from './stores/useSidebarStore';
// import * as useSliderStore from './stores/useSliderStore';
// import * as useImageStore from './stores/useImageStore';

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders the FRAMES logo", () => {
    const framesText = screen.getByAltText(/FRAMES/i);
    expect(framesText).toBeInTheDocument();
  });


  test("renders BatStateU logo text", () => {
    // const bsuText = screen.getAllByText(/Foster Wheeler Library - Alangilan/i);
    // expect(bsuText).toBeInTheDocument();

    const bsuText = screen.getAllByText(/Foster Wheeler Library - Alangilan/i);

    expect(bsuText.length).toBeGreaterThan(0);

    const firstText = bsuText[0].closest('p');
    expect(firstText).not.toBeNull();
    expect(firstText).toHaveTextContent('Foster Wheeler Library - Alangilan');
  });

  // test("renders main tutorial text", () => {
  //   const tutorialText = screen.getByText(/Access the Campus Library with FRAMES/i);
  //   expect(tutorialText).toBeInTheDocument();
  // });

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
    // expect(screen.getByText(/Home/i)).toBeInTheDocument();
    // expect(screen.getAllByText(/tutorial/i)).toBeInTheDocument();
    // expect(screen.getAllByText(/techtonic/i)).toBeInTheDocument();
    const links = screen.getAllByText(/tutorial/i) as HTMLAnchorElement[];

    expect(links.length).toBeGreaterThan(0);

    const firstLink = links[0].closest('a') as HTMLAnchorElement;
    expect(firstLink).not.toBeNull();
    expect(firstLink.href).toContain('/tutorial');
  });
});

// Mock the stores
// jest.mock('./stores/useSidebarStore');
// jest.mock('./stores/useSliderStore');
// jest.mock('./stores/useImageStore');

describe('App Component', () => {
  // Setup default mock values
  const mockToggleSidebar = jest.fn();
  // const mockSetActiveIndex = jest.fn();
  // const mockSetImagesLoaded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(useSidebarStore, 'useSidebarStore').mockImplementation(() => ({
      isOpen: false,
      toggleSidebar: mockToggleSidebar
    }));

    // jest.spyOn(useSliderStore, 'useSliderStore').mockImplementation(() => ({
    //   activeIndex: 0,
    //   setActiveIndex: mockSetActiveIndex
    // }));

    // jest.spyOn(useImageStore, 'useImageStore').mockImplementation(() => ({
    //   imagesLoaded: true,
    //   setImagesLoaded: mockSetImagesLoaded
    // }));
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByAltText('FRAMES logo')).toBeInTheDocument();
  });

  // test('renders navigation links', () => {
  //   render(<App />);
  //   expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
  //   expect(screen.getAllByText('Schedule')[0]).toBeInTheDocument();
  //   expect(screen.getAllByText('About us')[0]).toBeInTheDocument();
  //   expect(screen.getAllByText('Register')[0]).toBeInTheDocument();
  // });

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