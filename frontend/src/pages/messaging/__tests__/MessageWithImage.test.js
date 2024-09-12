import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { axiosRes } from '../../../api/axiosDefaults';
import Message from '../Message';

jest.mock('../../../contexts/CurrentUserContext', () => ({
  useCurrentUser: () => ({ pk: '1' }),
}));

jest.mock('../../../api/axiosDefaults', () => ({
  axiosRes: {
    get: jest.fn(),
  },
}));

describe('Message component with image', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders message with image', async () => {
    axiosRes.get.mockResolvedValue({
      data: {
        username: 'testuser',
      },
    });

    const props = {
      id: 1,
      sender: 1,
      sender_profile_id: '1',
      sender_profile_image: 'https://example.com/avatar.jpg',
      content: 'Test message with image',
      image: 'https://example.com/test-image.jpg',
      date: '2024-08-27',
      time: '12:00',
      setMessages: jest.fn(),
      showAvatar: true,
    };

    await act(async () => {
      render(
        <Router>
          <Message {...props} />
        </Router>
      );
    });

    expect(screen.getByText('Test message with image')).toBeInTheDocument();

    const messageImage = screen.getByAltText('Message attachment');
    expect(messageImage).toBeInTheDocument();
    expect(messageImage).toHaveAttribute('src', 'https://example.com/test-image.jpg');

    expect(axiosRes.get).toHaveBeenCalledWith(`/users/${props.sender}/`);
  });
});