// src/api/axiosDefaults.js

import axios from "axios";

axios.defaults.baseURL = "https://odyssey-api-lmcreans-projects.vercel.app";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const axiosReq = axios.create();
export const axiosRes = axios.create();
