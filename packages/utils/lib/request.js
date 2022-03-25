import axios from 'axios';

axios.defaults.baseURL = process.env.CR_BASE_URL ? process.env.CR_BASE_URL : 'http://localhost:7001';
axios.defaults.timeout = 7000;
axios.interceptors.request.use(
  function ({ data, ...config }) {
    // 在发送请求之前做些什么
    if (data) {
      config.data = { args: [data] };
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

export const request = axios;
