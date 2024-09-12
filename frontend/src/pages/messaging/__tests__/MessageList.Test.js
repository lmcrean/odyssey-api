// src/pages/messaging/__tests__/MessageList.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axiosReq } from '../../../api/axiosDefaults';
import MessageList from '../MessageList';

// Mock the axiosReq module
jest.mock('../../../api/axiosDefaults', () => ({
  axiosReq: {
    get: jest.fn(),
  },
}));

describe('MessageList', () => {
  it('fetches and displays messages using dj-rest-auth', async () => {
    // Mock the response from the API
    const mockMessages = [
      {
        id: 1,
        username: 'testuser',
        recipient_profile_image: 'https://example.com/image.jpg',
        last_message: 'Hello, this is a test message',
        last_message_time: '12:00',
      },
    ];

    // Set up the mock response
    axiosReq.get.mockResolvedValueOnce({ data: mockMessages });

    // Render the component
    render(
      <MemoryRouter>
        <MessageList />
      </MemoryRouter>
    );

    // Check if the loading state (skeleton) is shown initially
    expect(screen.getByTestId('message-list-skeleton')).toBeInTheDocument();

    // Wait for the API call to resolve and check if the messages are displayed
    await waitFor(() => {
      expect(axiosReq.get).toHaveBeenCalledWith('/messages/?search=');
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
      expect(screen.getByText('12:00')).toBeInTheDocument();
    });
  });
});