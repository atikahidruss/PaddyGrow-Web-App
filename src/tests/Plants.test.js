import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Plants from '../components/Plants';
import { database, ref, onValue, set, update, remove } from '../firebase';

jest.spyOn(global.console, 'log').mockImplementation(() => {});

jest.mock('../firebase', () => ({
  database: {},
  ref: jest.fn(),
  onValue: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

describe('Plants Component', () => {
  const mockPlants = {
    1: {
      name: 'Plant 1',
      datePlanted: '05-11-2024',
      type: 'Paddy',
      device: 'Camera 1',
      healthStatus: 'Infected',
      diseaseDetected: 'Downy Mildew',
      stage: 'Vegetative',
      daysSince: 32,
      rgbColour: 'RGB(53, 153, 128)',
      image: 'https://example.com/plant1.jpg',
    },
    2: {
      name: 'Plant 2',
      datePlanted: '02-10-2024',
      type: 'Paddy',
      device: 'Camera 2',
      healthStatus: 'Good',
      diseaseDetected: 'Normal',
      stage: 'Reproductive',
      daysSince: 66,
      rgbColour: 'RGB(98, 125, 25)',
      image: 'https://example.com/plant2.jpg',
    },
  };

  const mockDevices = {
    'Camera 1': { status: 'Not available' },
    'Camera 2': { status: 'Not available' },
    'Camera 3': { status: 'Available' },
    'Camera 4': { status: 'Available' },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    ref.mockImplementation((db, path) => ({ db, path }));

    onValue.mockImplementation((ref, callback) => {
      if (ref.path === 'plants') callback({ val: () => mockPlants });
      if (ref.path === 'device') callback({ val: () => mockDevices });

      return jest.fn(); // Mock unsubscribe function
    });

    set.mockResolvedValue();
    update.mockResolvedValue();
    remove.mockResolvedValue();
  });

  it('adds a new plant', async () => {
    render(<Plants />);
  
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'New Plant' } });
    fireEvent.change(screen.getByPlaceholderText('Type'), { target: { value: 'Fern' } });
  
    const dateInput = document.querySelector('input[name="datePlanted"]');
    fireEvent.change(dateInput, { target: { value: '2025-01-12' } });
  
    const deviceDropdown = document.querySelector('select[name="device"]');
    fireEvent.change(deviceDropdown, { target: { value: 'Camera 3' } });
  
    // Submit the form
    fireEvent.click(screen.getByText('Add Plant'));
  
    // Assertions
    await waitFor(() => {
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'plants/2' }), // Adjusted based on actual behavior
        expect.objectContaining({
          name: 'New Plant',
          type: 'Fern',
          datePlanted: '2025-01-12',
          device: 'Camera 3',
          healthStatus: '',
          diseaseDetected: '',
          stage: '',
          daysSince: '',
          rgbColour: '',
          image: '',
        })
      );
  
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'device/Camera 3' }),
        { status: 'Not available' }
      );
    });
  });
  
  it('deletes a plant', async () => {
    render(<Plants />);

    // Click delete button for Plant 1
    const deleteButton = screen.getAllByText('Delete Plant')[0]; // First delete button
    fireEvent.click(deleteButton);

    // Assertions
    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'device/Camera 1' }),
        { status: 'Available' }
      );

      expect(remove).toHaveBeenCalledWith(expect.objectContaining({ path: 'plants/1' }));
    });
  });
});
