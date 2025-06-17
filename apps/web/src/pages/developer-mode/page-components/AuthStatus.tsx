import React, { useState, useEffect } from 'react';

import { LoginInput } from '../types';

import { InputForm } from './index';

interface AuthStatusProps {
  onLogin: (credentials: LoginInput) => Promise<void>;
  onLogout: () => void;
}

export default function AuthStatus({ onLogin, onLogout }: AuthStatusProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [isFlowRunning, setIsFlowRunning] = useState<boolean>(false);

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('auth_user');

    if (token) {
      setIsAuthenticated(true);

      if (userString) {
        try {
          setUser(JSON.parse(userString));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  const handleLogin = async (formData: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const credentials = {
        username: formData.username as string,
        password: formData.password as string,
      };
      await onLogin(credentials);
      setIsAuthenticated(true);
      setUser({ email: credentials.username });
      setShowLoginForm(false);
    } catch (_error) {
      console.error('Login error:', _error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      // First update our UI state
      setIsAuthenticated(false);
      setUser(null);

      // Then try to call the logout API
      onLogout();

      // Clear any localStorage items regardless of API success
      localStorage.removeItem('authToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still update UI and clear storage even if API call failed
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
    }
  };

  // Auth-Flow utility function
  const runAuthFlow = async () => {
    if (isFlowRunning) return;

    setIsFlowRunning(true);
    try {
      // Helper function to scroll element into view
      const scrollToElement = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };

      // Helper function to wait with a message
      const wait = async (ms: number, _message: string) => {
        await new Promise((resolve) => setTimeout(resolve, ms));
      };

      // Step 1: Find and click the "Generate Random User" button
      const generateButton = Array.from(
        document.querySelectorAll('button')
      ).find((button) => button.textContent?.includes('Generate Random User'));

      if (generateButton) {
        scrollToElement(generateButton as HTMLElement);
        await wait(300, 'Scrolling to Generate Random User button');
        (generateButton as HTMLButtonElement).click();

        // Wait for the credentials to be generated
        await wait(800, 'Waiting for user credentials to be generated');

        // Step 2: Find and click the signup button
        const signupButton = document.querySelector(
          'button[data-testid="test-post -api-auth-signup-button"]'
        ) as HTMLButtonElement;
        if (signupButton) {
          scrollToElement(signupButton as HTMLElement);
          await wait(300, 'Scrolling to Signup button');

          signupButton.click();

          // Wait for the form to appear
          await wait(800, 'Waiting for signup form to appear');

          // Step 3: Find and click the "Send POST Request" button for signup
          // Look for the Send POST Request button within the signup section
          const signupForms = document.querySelectorAll('form');
          let sendSignupButton: HTMLButtonElement | null = null;

          // Search through all forms for the one with email and password and username fields
          for (const form of Array.from(signupForms)) {
            const hasEmailField = form.querySelector('input[name="email"]');
            const hasPasswordField = form.querySelector(
              'input[name="password"]'
            );
            const hasUsernameField = form.querySelector(
              'input[name="username"]'
            );

            if (hasEmailField && hasPasswordField && hasUsernameField) {
              // This is likely the signup form
              sendSignupButton = form.querySelector(
                'button[type="submit"]'
              ) as HTMLButtonElement;
              break;
            }
          }

          if (sendSignupButton) {
            scrollToElement(sendSignupButton as HTMLElement);
            await wait(300, 'Scrolling to Send POST Request button');

            sendSignupButton.click();

            // Wait for signup to complete
            await wait(1500, 'Waiting for signup to complete');

            // Step 4: Find and click the login button
            const loginButton = document.querySelector(
              'button[data-testid="test-post -api-auth-login-button"]'
            ) as HTMLButtonElement;
            if (loginButton) {
              scrollToElement(loginButton as HTMLElement);
              await wait(300, 'Scrolling to Login button');

              loginButton.click();

              // Wait for the form to appear
              await wait(800, 'Waiting for login form to appear');

              // Step 5: Find and click "Use Latest Signup Credentials" button
              const useCredentialsButton = Array.from(
                document.querySelectorAll('button')
              ).find((button) =>
                button.textContent?.includes('Use Latest Signup Credentials')
              );

              if (useCredentialsButton) {
                scrollToElement(useCredentialsButton as HTMLElement);
                await wait(
                  300,
                  'Scrolling to Use Latest Signup Credentials button'
                );
                (useCredentialsButton as HTMLButtonElement).click();

                // Wait for credentials to be populated
                await wait(800, 'Waiting for credentials to be populated');

                // Step 6: Find and click the "Send POST Request" button for login
                // Look for the Send POST Request button within the login section
                const loginForms = document.querySelectorAll('form');
                let sendLoginButton: HTMLButtonElement | null = null;

                // Search through all forms for the one with username and password fields but no email
                for (const form of Array.from(loginForms)) {
                  const hasUsernameField = form.querySelector(
                    'input[name="username"]'
                  );
                  const hasPasswordField = form.querySelector(
                    'input[name="password"]'
                  );
                  const hasEmailField = form.querySelector(
                    'input[name="email"]'
                  );

                  if (hasUsernameField && hasPasswordField && !hasEmailField) {
                    // This is likely the login form
                    sendLoginButton = form.querySelector(
                      'button[type="submit"]'
                    ) as HTMLButtonElement;
                    break;
                  }
                }

                if (sendLoginButton) {
                  scrollToElement(sendLoginButton as HTMLElement);
                  await wait(
                    300,
                    'Scrolling to Send POST Request button for login'
                  );

                  sendLoginButton.click();

                  // Wait for login to complete - use a longer delay to ensure token is saved
                  await wait(
                    2500,
                    'Waiting for login to complete and token to be saved'
                  );

                  // Check if authentication worked - more comprehensive check
                  const authToken = localStorage.getItem('authToken');
                  const userString = localStorage.getItem('auth_user');
                  const isAuthSuccess =
                    authToken ||
                    userString ||
                    document.querySelector('.bg-green-500');

                  if (isAuthSuccess) {
                    // Refresh auth status from localStorage
                    if (userString) {
                      try {
                        const userData = JSON.parse(userString);
                        setIsAuthenticated(true);
                        setUser({ email: userData.email });

                        // Scroll back to the top to show the authentication status
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (_error) {
                        console.error('Error parsing user data:', _error);
                        // Still consider success if we found a token or green status indicator
                        setIsAuthenticated(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    } else {
                      // No user data but we have a token or green status indicator
                      setIsAuthenticated(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } else {
                    console.warn(
                      'Auth flow completed but no token found. This may still have worked correctly - check UI for login status.'
                    );

                    // Refresh the auth status for reliability
                    const hasGreenStatus =
                      document.querySelector('.bg-green-500');
                    if (hasGreenStatus) {
                      setIsAuthenticated(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      alert(
                        'Auth flow likely succeeded - UI shows logged in state.'
                      );
                    } else {
                      console.error(
                        'Auth flow likely failed - UI shows not logged in.'
                      );
                      alert(
                        'Auth flow may have failed: No authentication indicators found. Check your login status in the UI.'
                      );
                    }
                  }
                } else {
                  console.error(
                    'Could not find Send POST Request button for login'
                  );
                }
              } else {
                console.error(
                  'Could not find Use Latest Signup Credentials button'
                );
              }
            } else {
              console.error('Could not find Login button');
            }
          } else {
            console.error('Could not find Send POST Request button for signup');
          }
        } else {
          console.error('Could not find Signup button');
        }
      } else {
        console.error('Could not find Generate Random User button');
      }
    } catch (error) {
      console.error('Error during auth flow:', error);
    } finally {
      setIsFlowRunning(false);
    }
  };

  return (
    <div className="mb-10 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 shadow-2xl p-6">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-slate-100">Authentication Status</h2>
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="relative">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isAuthenticated 
                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' 
                    : 'bg-rose-400 shadow-lg shadow-rose-400/50'
                }`}
              ></div>
              {isAuthenticated && (
                <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
              )}
            </div>
            <span className={`font-medium ${isAuthenticated ? 'text-emerald-300' : 'text-rose-300'}`}>
              {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
            </span>
          </div>
          
          {isAuthenticated && user && (
            <div className="text-sm text-slate-400 italic ml-7">
              Logged in as: <span className="text-slate-300 font-medium">{user.email}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-rose-500/90 hover:bg-rose-500 px-5 py-2.5 text-white font-medium transition-all duration-200 border border-rose-400/50 hover:border-rose-300/60 hover:shadow-lg hover:shadow-rose-500/25 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="rounded-lg bg-blue-500/90 hover:bg-blue-500 px-5 py-2.5 text-white font-medium transition-all duration-200 border border-blue-400/50 hover:border-blue-300/60 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              {showLoginForm ? 'Cancel' : 'Login'}
            </button>
          )}

          {/* Auth-Flow utility button */}
          <div className="text-center sm:text-left">
            <button
              type="button"
              onClick={runAuthFlow}
              disabled={isFlowRunning}
              className="rounded-lg bg-emerald-500/90 hover:bg-emerald-500 disabled:bg-slate-600/50 disabled:text-slate-400 px-5 py-2.5 text-white font-medium transition-all duration-200 border border-emerald-400/50 hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isFlowRunning ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                  <span>Running...</span>
                </span>
              ) : (
                'Auto Auth Flow'
              )}
            </button>
            <div className="text-xs text-slate-400 italic mt-2 max-w-xs">
              Click to quickly signup and login with a random user
            </div>
          </div>
        </div>
      </div>

      {showLoginForm && !isAuthenticated && (
        <div className="mt-6 rounded-xl bg-slate-900/80 border border-slate-700/50 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <h3 className="text-lg font-semibold text-slate-200">Login</h3>
          </div>
          <InputForm
            fields={[
              {
                name: 'username',
                label: 'Username',
                type: 'text',
                required: true,
                placeholder: 'your_username',
              },
              {
                name: 'password',
                label: 'Password',
                type: 'password',
                required: true,
                placeholder: 'Your password',
              },
            ]}
            onSubmit={handleLogin}
            submitLabel="Login"
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
