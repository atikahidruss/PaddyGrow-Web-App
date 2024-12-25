import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Notification from '../components/Notification';
import { database, ref, onValue, remove } from '../firebase';

jest.mock('../firebase', () => ({
  database: {},
  ref: jest.fn(),
  onValue: jest.fn(),
  remove: jest.fn(),
}));

describe('Notification Component', () => {
  const mockNotifications = {
    1: { timestamp: '2023-12-01 10:00:00', message: 'Motion is detected', type: 'alert' },
    2: { timestamp: '2023-12-01 11:00:00', message: 'Plant 2 is infected', type: 'warning' },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    ref.mockImplementation((db, path) => ({ db, path }));

    onValue.mockImplementation((ref, callback) => {
      if (ref.path === 'notifications') callback({ val: () => mockNotifications });

      return jest.fn(); // Mock unsubscribe function
    });

    remove.mockResolvedValue();
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original console.log
  });

  it('renders the Telegram link', () => {
    render(<Notification />);
    const telegramLink = screen.getByText(/click here to receive mobile notification!/i);
    expect(telegramLink).toBeInTheDocument();
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/+Xj7JO4Qp9M85Nzg1');
  });

  it('renders notifications from Firebase', async () => {
    render(<Notification />);

    // Wait for notifications to load
    const notificationItems = await screen.findAllByRole('listitem');
    expect(notificationItems).toHaveLength(2);

    // Assert content of the first notification
    expect(screen.getByText('2023-12-01 10:00:00')).toBeInTheDocument();
    expect(screen.getByText('Motion is detected')).toBeInTheDocument();

    // Assert content of the second notification
    expect(screen.getByText('2023-12-01 11:00:00')).toBeInTheDocument();
    expect(screen.getByText('Plant 2 is infected')).toBeInTheDocument();
  });

  it('clears a notification when the clear button is clicked', async () => {
    render(<Notification />);

    // Wait for notifications to load
    const clearButtons = await screen.findAllByText('Clear');
    expect(clearButtons).toHaveLength(2);

    // Click the clear button for the first notification
    fireEvent.click(clearButtons[0]);

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith(expect.objectContaining({ path: 'notifications/1' }));
    });

    // Ensure console.log is called for a successful clear
    expect(console.log).toHaveBeenCalledWith('Notification cleared successfully');
  });
});
