import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { signUpApi } from '../core/utility/services/signUp.service';
import { authReducer } from '../features/auth/auth';
import { loaderReducer } from '../features/loader/loader';
import { adminApi } from '../pages/admin/utility/services/admin.service';
import { notificationApi } from '../pages/admin/utility/services/notification.service';
import { userApi } from '../pages/user/utility/services/user.service';
import { searchReducer } from '../features/search/search';

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [signUpApi.reducerPath]: signUpApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    auth: authReducer,
    search:searchReducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      adminApi.middleware,
      signUpApi.middleware,
      userApi.middleware,
      notificationApi.middleware,
    ]),
});

type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
