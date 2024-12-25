import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Plants from '../components/Plants';
import { database, ref, onValue, set, update, remove } from '../firebase';

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
      datePlanted: '2023-10-01',
      type: 'Cactus',
      device: 'Device1',
    },
  };

  const mockDevices = {
    Device1: { status: 'Available' },
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
  
    // Target the date input field by its name attribute
    const dateInput = document.querySelector('input[name="datePlanted"]');
    fireEvent.change(dateInput, { target: { value: '2023-10-10' } });
  
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Device1' } });
  
    // Submit the form
    fireEvent.click(screen.getByText('Add Plant'));
  
    // Assertions
    await waitFor(() => {
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'plants/2' }),
        expect.objectContaining({
          name: 'New Plant',
          type: 'Fern',
          datePlanted: '2023-10-10',
          device: 'Device1',
        })
      );
  
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'device/Device1' }),
        { status: 'Not available' }
      );
    });
  });  
  
  it('deletes a plant', async () => {
    render(<Plants />);

    // Click delete button
    const deleteButton = await screen.findByText('Delete Plant');
    fireEvent.click(deleteButton);

    // Assertions
    await waitFor(() => {
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'device/Device1' }),
        { status: 'Available' }
      );

      expect(remove).toHaveBeenCalledWith(expect.objectContaining({ path: 'plants/1' }));
    });
  });
});
