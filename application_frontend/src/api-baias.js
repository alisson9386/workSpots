import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: "http://localhost:3001",
  });
  api.interceptors.request.use(async (config) => {
    const token = Cookies.get( 'token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default api;