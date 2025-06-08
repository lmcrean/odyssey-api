import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from '../../../contexts/CurrentUserContext';
import SignInForm from '../SignInForm';
import axios from 'axios';
import * as utils from '../../../utils/utils';
import * as currentUserContext from '../../../contexts/CurrentUserContext';

jest.mock('../../../utils/utils', () => ({
  setTokenTimestamp: jest.fn(),
}));

jest.mock('axios');

jest.mock('../../../api/axiosDefaults', () => ({
  axiosReq: {
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
  axiosRes: {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}));

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('SignInForm', () => {
  it('submits the form and handles successful sign-in', async () => {
    const mockSetCurrentUser = jest.fn();
    jest.spyOn(currentUserContext, 'useSetCurrentUser').mockImplementation(() => mockSetCurrentUser);

    render(
      <Router>
        <CurrentUserProvider>
          <SignInForm />
        </CurrentUserProvider>
      </Router>
    );

    const mockResponse = {
      data: {
        user: { username: 'testuser' },
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(utils.setTokenTimestamp).toHaveBeenCalledWith(mockResponse.data);
    });

    // Wait for the axios call and subsequent actions
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/dj-rest-auth/login/', {
        username: 'testuser',
        password: 'password123',
      });
    });

    // Check if tokens were stored in localStorage
    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBe('fake-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('fake-refresh-token');
    });

    // Check if setCurrentUser was called
    await waitFor(() => {
      expect(mockSetCurrentUser).toHaveBeenCalledWith({ username: 'testuser' });
    });

    // Check if user was redirected
    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
  });
});