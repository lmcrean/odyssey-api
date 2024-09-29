// src/hooks/useRedirect.js

import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      const refreshToken = localStorage.getItem('refresh_token');

      // Only attempt to refresh the token if the userAuthStatus is "loggedIn" and a refresh token exists
      if (userAuthStatus === "loggedIn" && refreshToken) {
        try {
          await axios.post("/dj-rest-auth/token/refresh/", {
            refresh: refreshToken,
          });
          history.push("/");
        } catch (err) {
          console.error("Token refresh failed:", err.response?.data || err.message);
          // if user is not logged in, the code below will run
          if (userAuthStatus === "loggedOut") {
            history.push("/");
          }
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus]);
};
