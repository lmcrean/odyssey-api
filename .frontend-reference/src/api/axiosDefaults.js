// src/api/axiosDefaults.js

import axios from "axios";

// Use environment variable for backend URL, with fallback for development
const backendURL = process.env.REACT_APP_BACKEND_URL || "https://odyssey-api-lmcreans-projects.vercel.app";

axios.defaults.baseURL = backendURL;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const axiosReq = axios.create();
export const axiosRes = axios.create();
