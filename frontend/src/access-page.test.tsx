import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FacialRecognitionAccess from '../components/FacialRecognitionAccess';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe("Facial Recognition Access", () => {
  it("renders without crashing", () => {
    render(<FacialRecognitionAccess />);
    expect(screen.getByText("FRAMES")).toBeInTheDocument();
  });

  it("shows 'Temporary Unavailable' if service is down", async () => {
    fetch.mockReject(new Error("Service is down"));

    render(<FacialRecognitionAccess />);

    const accessButton = screen.getByText("SR-CODE");
    fireEvent.click(accessButton);

    const unavailableText = await waitFor(() => screen.getByText("TEMPORARY UNAVAILABLE"));
    expect(unavailableText).toBeInTheDocument();
  });

  it("allows access when SR-Code is correct", async () => {
    fetch.mockResponseOnce(JSON.stringify({ accessGranted: true }));

    render(<FacialRecognitionAccess />);

    const accessButton = screen.getByText("SR-CODE");
    fireEvent.click(accessButton);

    const grantedText = await waitFor(() => screen.getByText("Access Granted"));
    expect(grantedText).toBeInTheDocument();
  });

  it("denies access when SR-Code is incorrect", async () => {
    fetch.mockResponseOnce(JSON.stringify({ accessGranted: false }));

    render(<FacialRecognitionAccess />);

    const accessButton = screen.getByText("SR-CODE");
    fireEvent.click(accessButton);

    const deniedText = await waitFor(() => screen.getByText("Access Denied"));
    expect(deniedText).toBeInTheDocument();
  });
});
