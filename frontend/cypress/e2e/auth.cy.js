// auth.cy.js
describe('User Authentication', () => {
  const BASE_URL = 'http://localhost:8000';

  it('User can sign in with dj-rest-auth', () => {
    // 1. Attempt to sign in
    cy.request('POST', `${BASE_URL}/api/dj-rest-auth/login/`, {
      username: 'user',
      password: 'qwerqwer*'
    }).then((response) => {
      // 2. Check if sign-in was successful
      expect(response.status).to.eq(200);
      const { access_token, refresh_token } = response.body;

      // 3. Set tokens in localStorage
      cy.visit(BASE_URL);
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', access_token);
        win.localStorage.setItem('refreshToken', refresh_token);
      });

      // 4. Verify tokens are set correctly
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.eq(access_token);
        expect(win.localStorage.getItem('refreshToken')).to.eq(refresh_token);
      });

      // 5. Use access token to make an authenticated request
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/api/dj-rest-auth/user/`,
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }).then((userResponse) => {
        // 6. Check if authenticated request was successful
        expect(userResponse.status).to.eq(200);
        expect(userResponse.body).to.have.property('username', 'user');

        console.log('Authentication successful. User data:', userResponse.body);
      });
    });
  });
});