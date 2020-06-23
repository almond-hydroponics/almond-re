// third-party libraries
import { displayInternalServerErrorMessage } from '@modules/internalServerError';
import CacheHandler from '@utils/helpers/CacheHandler';
import axios from 'axios';

// helpers
import { authService } from '@utils/auth';
import store from '../../store';

const token = authService.getToken();

const http = axios.create({
  baseURL: process.env.ALMOND_API,
  headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
});

http.interceptors.request.use(config => {
  if (authService.isExpired()) authService.redirectUser();
  return config;
});

http.interceptors.response.use(
  response => {
    const { method, url } = response.config;
    const endpoint: string = CacheHandler.extractUrlEndpoint(url);

    if (method !== 'get' && endpoint) {
      const requestTimestamp = (new Date).getTime();
      CacheHandler.cacheInvalidationRegister[endpoint] = requestTimestamp;

      if (endpoint === '/roles') {
        CacheHandler.cacheInvalidationRegister['/dashboard'] = requestTimestamp;
      }
    }

    return response;
  },
  error => {
    if (error.response.status === 500 && error.response.data.message.includes('token')) {
      authService.redirectUser();
    } else if (error.response.status === 500) {
      store.dispatch(displayInternalServerErrorMessage(true));
    }

    return Promise.reject(error);
  }
);

export default http;
