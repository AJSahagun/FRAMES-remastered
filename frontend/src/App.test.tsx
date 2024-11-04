import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import * as useSidebarStore from './stores/useSidebarStore';
import * as useSliderStore from './stores/useSliderStore';
import * as useImageStore from './stores/useImageStore';

// Mock the stores
jest.mock('./stores/useSidebarStore');
jest.mock('./stores/useSliderStore');
jest.mock('./stores/useImageStore');

describe('App Component', () => {
  // Setup default mock values
  const mockToggleSidebar = jest.fn();
  const mockSetActiveIndex = jest.fn();
  const mockSetImagesLoaded = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    jest.spyOn(useSidebarStore, 'useSidebarStore').mockImplementation(() => ({
      isOpen: false,
      toggleSidebar: mockToggleSidebar
    }));

    jest.spyOn(useSliderStore, 'useSliderStore').mockImplementation(() => ({
      activeIndex: 0,
      setActiveIndex: mockSetActiveIndex
    }));

    jest.spyOn(useImageStore, 'useImageStore').mockImplementation(() => ({
      imagesLoaded: true,
      setImagesLoaded: mockSetImagesLoaded
    }));
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByAltText('FRAMES logo')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<App />);
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Schedule')[0]).toBeInTheDocument();
    expect(screen.getAllByText('About us')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Register')[0]).toBeInTheDocument();
  });

  test('image slider changes after interval', () => {
    jest.useFakeTimers();
    render(<App />);
    
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(mockSetActiveIndex).toHaveBeenCalled();
    
    jest.useRealTimers();
  });
});