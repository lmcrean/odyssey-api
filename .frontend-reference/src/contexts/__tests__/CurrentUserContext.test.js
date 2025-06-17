import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { CurrentUserProvider, useCurrentUser, SetCurrentUserContext } from '../CurrentUserContext';
import { axiosRes } from '../../api/axiosDefaults';

// Mock axiosRes
jest.mock('../../api/axiosDefaults');

describe('CurrentUserContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should fetch user data when access token exists', async () => {
    const mockUserData = { id: 1, username: 'testuser' };
    axiosRes.get.mockResolvedValueOnce({ data: mockUserData });
  
    let capturedUser;
    let setCurrentUser;

    const TestComponent = () => {
      const currentUser = useCurrentUser();
      setCurrentUser = React.useContext(SetCurrentUserContext);
      React.useEffect(() => {
        capturedUser = currentUser;
      }, [currentUser]);
      return null;
    };

    await act(async () => {
      localStorage.setItem('accessToken', 'fake-access-token');
      localStorage.setItem('refreshToken', 'fake-refresh-token');

      render(
        <CurrentUserProvider>
          <TestComponent />
        </CurrentUserProvider>
      );
    });

    await waitFor(() => {
      expect(axiosRes.get).toHaveBeenCalledWith('dj-rest-auth/user/');
      expect(capturedUser).toEqual(mockUserData);
    });
  });
});