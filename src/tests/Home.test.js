import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import '@testing-library/jest-dom'; // Import matchers

// Mock Firebase
jest.mock('../firebase', () => {
  const originalModule = jest.requireActual('../firebase');
  return {
    ...originalModule,
    database: jest.fn(),
    ref: jest.fn(),
    onValue: jest.fn(),
  };
});

const { onValue } = require('../firebase');

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the homepage with the default UI elements', () => {
    // Mock Firebase with an empty unsubscribe function
    onValue.mockImplementation((ref, callback, errorCallback) => {
      // Mock empty data callback
      callback({ val: () => null });
      return jest.fn(); // Return a mock unsubscribe function
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByAltText('Paddy Field')).toBeInTheDocument();
    expect(screen.getByText('Seeding Innovation, Harvesting Efficiency')).toBeInTheDocument();
  });

  test('displays plant data fetched from Firebase', async () => {
    const mockPlants = {
      plant1: { name: 'Plant 1' },
      plant2: { name: 'Plant 2' },
    };

    onValue.mockImplementation((ref, callback) => {
      callback({ val: () => mockPlants });
      return jest.fn(); // Mock unsubscribe function
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Plant 1')).toBeInTheDocument();
      expect(screen.getByText('Plant 2')).toBeInTheDocument();
    });
  });

  test('displays no plants if Firebase data is empty', async () => {
    onValue.mockImplementation((ref, callback) => {
      callback({ val: () => null });
      return jest.fn(); // Mock unsubscribe function
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  test('handles Firebase errors gracefully', async () => {
    onValue.mockImplementation((ref, callback, errorCallback) => {
      errorCallback(new Error('Error fetching plants'));
      return jest.fn(); // Mock unsubscribe function
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching plants:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
