import { showNotification } from '@mantine/notifications';
import axios, { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../../features/loader/loader';

export const AuthInterceptor = () => {
  const dispatch = useDispatch();
  // requests
  axios.interceptors.request.use(
    (req) => {
      const authToken = localStorage.getItem('token');

      if (req.url?.endsWith('/notification')) {
        dispatch(setIsLoading(false));
      } else if (req.url?.endsWith('/update-notification?IsRead=true')) {
        dispatch(setIsLoading(false));
      } else {
        dispatch(setIsLoading(true));
      }
      if (!req.url?.endsWith('/login' || '/register')) {
        req.headers['Authorization'] = `Bearer ${authToken}`;
      }
      return req;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      console.log(error, 'error');
      return Promise.reject(error);
    }
  );

  // response
  const axiosResponseInterceptor = axios.interceptors.response.use(
    (res: AxiosResponse) => {
      dispatch(setIsLoading(false));
      return res;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      dispatch(setIsLoading(false));
      if (error?.status !== 200) {
        if (error?.response.status === 404) {
          // navigate to page not found page
          return;
        } else if (error?.response.status === 400) {
          showNotification({
            title: 'Error',
            message: error?.response.data.error,
            color: 'red',
          });
        } else if (error?.response.status === 401) {
          showNotification({
            title: 'Error',
            message: error?.response.data.error,
            color: 'red',
          });
        } else if (error?.response.status === 409) {
          showNotification({
            title: 'Error',
            message: error?.response.data.error,
            color: 'red',
          });
        } else if (error?.response.status === 500) {
          showNotification({
            title: 'Error',
            message: error?.response.data.error,
            color: 'red',
          });
        }
      }
      return error;
    }
  );
  useEffect(() => () => {
    axios.interceptors.response.eject(axiosResponseInterceptor);
  });
  return null;
};
