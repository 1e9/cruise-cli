import axios from 'axios';

axios.defaults.baseURL = process.env.CR_BASE_URL ? process.env.CR_BASE_URL : 'http://localhost:7001';
axios.defaults.timeout = 7000;
axios.interceptors.request.use(
  function ({ data, ...config }) {
    if (data) {
      config.data = { args: [data] };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const request = axios;
