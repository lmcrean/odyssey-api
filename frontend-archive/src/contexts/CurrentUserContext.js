import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { removeTokenTimestamp, shouldRefreshToken, setTokenTimestamp } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleMount = async () => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
      
      return;
    }

    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      
      setCurrentUser(data);
    } catch (err) {
      
      if (err.response?.status === 401) {
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        removeTokenTimestamp();
      }
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useEffect(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        
        if (shouldRefreshToken()) {
          
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            
            const { data } = await axios.post("/dj-rest-auth/token/refresh/", { refresh: refreshToken });
            
            localStorage.setItem("accessToken", data.access);
            setTokenTimestamp(data);
            
          } catch (err) {
            
            setCurrentUser(null);
            removeTokenTimestamp();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
        return config;
      },
      (err) => {
        
        return Promise.reject(err);
      }
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        
        if (err.response?.status === 401) {
          
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            
            const { data } = await axios.post("/dj-rest-auth/token/refresh/", { refresh: refreshToken });
            
            localStorage.setItem("accessToken", data.access);
            setTokenTimestamp(data);
            
            return axios(err.config);
          } catch (refreshErr) {
            
            setCurrentUser(null);
            removeTokenTimestamp();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
