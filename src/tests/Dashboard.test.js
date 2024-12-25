import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component', () => {
  test('displays plant details', () => {
    const mockPlantData = {
      name: 'Test Plant',
      datePlanted: '2023-01-01',
      type: 'Wheat',
    };

    render(
      <Dashboard testMode={true} mockData={mockPlantData} />
    );

    expect(screen.getByText('Test Plant')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    expect(screen.getByText('Wheat')).toBeInTheDocument();
  });

  test('displays error message when no data is found', () => {
    render(<Dashboard testMode={true} mockData={null} />);

    expect(screen.getByText('Error: No plants found')).toBeInTheDocument();
  });
});
