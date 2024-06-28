import { createApi } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../../../environments/environment';
import { Constants } from '../../../../shared/utility/constants/shared.constant';
import { axiosBaseQuery } from '../../../../shared/utility/services/axiosBaseQuery.service';
import { IDataRes } from '../../../user/utility/models/user.model';
import {
  IUpdateUserStatusParams,
  IUserDetailsParams,
  IUserListQueryParams,
  IUserListRes,
  IUserStatusCount,
  IUserStatusCountByMonth,
} from '../models/admin.model';
import { ICreateUserForm } from '../models/createUser.model';
import { IUserDetail } from '../models/userDetail.model';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    // get user-list data
    getUserListData: builder.query<
      IDataRes<IUserListRes>,
      IUserListQueryParams
    >({
      query: ({ statusId, pageNumber, pageSize, SearchParam }) => ({
        url: `admin/users/${statusId}?pageNumber=${pageNumber}&pageSize=${pageSize}&SearchParam=${SearchParam}`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    // approve and reject user registration
    postApproveRejectUserList: builder.mutation<void, { approveUserList: any }>(
      {
        query: (approveUserList) => ({
          url: Constants.END_POINTS.REGISTRATION_REQUESTS,
          method: 'POST',
          data: approveUserList,
        }),
        invalidatesTags: ['Admin'],
      }
    ),
    // Create new User
    createUserSubmit: builder.mutation<void, ICreateUserForm>({
      query: (createUserData: ICreateUserForm) => ({
        url: Constants.END_POINTS.CREATE_USER,
        method: 'POST',
        data: createUserData,
      }),
      invalidatesTags: ['Admin'],
    }),
    // update user Account-status
    updateApproveUserList: builder.mutation<void, IUpdateUserStatusParams>({
      query: ({ userId, isActive }) => ({
        url: `admin/${userId}/account-status?isActive=${isActive}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Admin'],
    }),

    // get user-details
    getUserDeatils: builder.query<IDataRes<IUserDetail>, IUserDetailsParams>({
      query: ({ userId }) => ({
        url: `admin/${userId}/details`,
        method: 'GET',
      }),
    }),

    // get user status count
    getUserStatusCount: builder.query<IDataRes<IUserStatusCount>, void>({
      query: () => ({
        url: 'admin/user-reports/user-status-count',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    // get user status count by month
    getUserStatusCountByMonth: builder.query<
      IDataRes<IUserStatusCountByMonth>,
      { month: number; year: number }
    >({
      query: ({ month, year }) => ({
        url: `admin/user-reports/activity-charts?month=${month}&year=${year}`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetUserListDataQuery,
  useLazyGetUserListDataQuery,
  usePostApproveRejectUserListMutation,
  useUpdateApproveUserListMutation,
  useCreateUserSubmitMutation,
  useGetUserDeatilsQuery,
  useLazyGetUserDeatilsQuery,
  useGetUserStatusCountQuery,
  useGetUserStatusCountByMonthQuery,
} = adminApi;
