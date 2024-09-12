// src/api/axiosDefaults.js

import axios from "axios";

axios.defaults.baseURL = "https://odyssey-api-f3455553b29d.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
