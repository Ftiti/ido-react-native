import axios from "axios";

const API_BASE_URL = "http://192.168.100.88:3000/api/v2/";
const WEB_BASE_WRL = "http://192.168.100.88:3000/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token dynamically if using auth
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
