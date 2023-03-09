import axios from 'axios';

// See auth_utils for AuthInterceptor
const GSPBackend = axios.create({
  baseURL:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_BACKEND_HOST
      : process.env.REACT_APP_BACKEND_HOST_PROD,
  withCredentials: true,
});

// eslint-disable-next-line import/prefer-default-export
export { GSPBackend };
