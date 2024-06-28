import { createApi } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../../../environments/environment';
import { Constants } from '../../../../shared/utility/constants/shared.constant';
import { axiosBaseQuery } from '../../../../shared/utility/services/axiosBaseQuery.service';
import { IDataRes } from '../../../user/utility/models/user.model';
import { INotificationRes } from '../models/admin.model';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query<IDataRes<INotificationRes>, void>({
      query: () => ({
        url: Constants.END_POINTS.GET_NOTIFICATION,
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),
    updateNotifications: builder.mutation<void, void>({
      query: () => ({
        url: Constants.END_POINTS.UPDATE_NOTIFICATION + '?IsRead=true',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});
export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useUpdateNotificationsMutation,
} = notificationApi;
