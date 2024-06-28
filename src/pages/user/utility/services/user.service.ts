import { createApi } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../../../environments/environment';
import { axiosBaseQuery } from '../../../../shared/utility/services/axiosBaseQuery.service';
import { MONTHS } from '../constants/user.constant';
import {
  IAlertRes,
  ICategoriesRes,
  IChangePasswordReq,
  ICitiesTypeRes,
  ICountryTypeRes,
  IDataRes,
  IEditUserProfile,
  IExpenseIncomeReports,
  IExpenseIncomeReq,
  IExpenseIncomeRes,
  IExpenseIncomeStatistics,
  IExportTransaction,
  IExportTransactionQueryParams,
  IReminderCountDataRes,
  IReminderDetails,
  IReminderListRes,
  IReminderReq,
  IRes,
  IStatesTypeRes,
  ITransactionsDetailsRes,
  ITransactionsQueryParams,
  IUserData,
} from '../models/user.model';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    /** get user */
    getUser: builder.query<IDataRes<IUserData>, string>({
      query: (subjectId) => ({
        url: `users/${subjectId}`,
        method: 'GET',
      }),
    }),

    /** gets category item */
    getCategoryItem: builder.query<IDataRes<ICategoriesRes>, number>({
      query: (categoryTypeId) => ({
        url: `categories/${categoryTypeId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /** gets user income expense list data */
    getIncomeExpenseData: builder.query<
      IDataRes<IExpenseIncomeRes>,
      ITransactionsQueryParams
    >({
      query: ({
        userId,
        categoryTypeId,
        pageNumber,
        pageSize,
        month,
        year,
      }) => ({
        url: `users/${userId}/income-expense?categoryTypeId=${categoryTypeId}&pageNumber=${pageNumber}&pageSize=${pageSize}&month=${month}&year=${year}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /** gets user transactions list data */
    getTransactionData: builder.query<
      IDataRes<ITransactionsDetailsRes>,
      ITransactionsQueryParams
    >({
      query: ({ userId, pageNumber, pageSize, month, year }) => ({
        url: `users/${userId}/transaction?pageNumber=${pageNumber}&pageSize=${pageSize}&month=${month}&year=${year}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // post call for income expense
    postIncomeExpenseData: builder.mutation<
      void,
      {
        userId: number;
        incomeExpenseData: IExpenseIncomeReq;
        categoryTypeId: number;
      }
    >({
      query: ({ incomeExpenseData, userId, categoryTypeId }) => ({
        url: `users/${userId}/add-income-expense?categoryTypeId=${categoryTypeId}`,
        method: 'POST',
        data: incomeExpenseData,
      }),
      invalidatesTags: ['User'],
    }),
    // Delete income expense transactions
    deleteIncomeExpenseData: builder.mutation<
      void,
      { userId: number; transactionId: number }
    >({
      query: ({ userId, transactionId }) => ({
        url: `users/${userId}/income-expense/${transactionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    // Edit income expense transactions
    editIncomeExpenseData: builder.mutation<
      void,
      {
        userId: number;
        transactionId: number;
        incomeExpenseData: IExpenseIncomeReq;
      }
    >({
      query: ({ userId, transactionId, incomeExpenseData }) => ({
        url: `users/${userId}/income-expense/${transactionId}`,
        method: 'PUT',
        data: incomeExpenseData,
      }),
      invalidatesTags: ['User'],
    }),
    // update user password
    updateUserPassword: builder.mutation<
      IDataRes<Object>,
      { subjectId: string; userPasswordData: IChangePasswordReq }
    >({
      query: ({ subjectId, userPasswordData }) => ({
        url: `/users/${subjectId}/change-password`,
        method: 'PUT',
        data: userPasswordData,
      }),
      invalidatesTags: ['User'],
    }),

    // get country
    getCountries: builder.query<IDataRes<ICountryTypeRes>, void>({
      query: () => ({
        url: '/countries',
        method: 'GET',
      }),
    }),

    // get states
    getStates: builder.query<IDataRes<IStatesTypeRes>, string | number>({
      query: (countryId) => ({
        url: `/states/${countryId}`,
        method: 'GET',
      }),
    }),

    // get states
    getCities: builder.query<IDataRes<ICitiesTypeRes>, string | number>({
      query: (stateId) => ({
        url: `/cities/${stateId}`,
        method: 'GET',
      }),
    }),

    // update user profile details
    updateUserProfile: builder.mutation<
      IEditUserProfile,
      { userId: number; userData: IEditUserProfile }
    >({
      query: ({ userId, userData }) => ({
        url: `users/${userId}/edit-profile`,
        method: 'PUT',
        data: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // get transaction details
    getTransactionDetails: builder.query<
      IRes<IExportTransaction>,
      IExportTransactionQueryParams
    >({
      query: ({ userId, month, year }) => ({
        url: `users/${userId}/transaction/export-pdf?year=${year}&month=${month}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /** gets alert item */
    getAlertItem: builder.query<IDataRes<IAlertRes>, void>({
      query: () => ({
        url: 'reminder-alert',
        method: 'GET',
      }),
    }),
    // post call for reminder
    postReminderData: builder.mutation<
      void,
      {
        userId: number;
        reminderData: IReminderReq;
      }
    >({
      query: ({ reminderData, userId }) => ({
        url: `users/${userId}/reminder`,
        method: 'POST',
        data: reminderData,
      }),
      invalidatesTags: ['User'],
    }),

    /** get date wise reminder list */
    getReminderList: builder.query<
      IDataRes<IReminderListRes>,
      { userId: number; year: number; month: number; date: number }
    >({
      query: ({ userId, year, month, date }) => ({
        url: `users/${userId}/reminder-list?year=${year}&month=${month}&date=${date}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /** get reminder by id */
    getReminderById: builder.query<
      IDataRes<IReminderDetails>,
      { userId: number; reminderId: number }
    >({
      query: ({ userId, reminderId }) => ({
        url: `/users/${userId}/reminder-details/${reminderId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    //delete Reminder
    deleteReminder: builder.mutation<
      void,
      { userId: number; reminderId: number }
    >({
      query: ({ userId, reminderId }) => ({
        url: `/users/${userId}/reminder/${reminderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    //get reminder count by month
    getReminderCountByMonth: builder.query<
      IDataRes<IReminderCountDataRes>,
      { userId: number; month: number; year: number }
    >({
      query: ({ userId, month, year }) => ({
        url: `/users/${userId}/reminder-count-by-month?year=${year}&month=${month}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // get dashboard details by month
    getDashboardDetailsByMonth: builder.query<
      IDataRes<IExpenseIncomeReports>,
      { userId: number; month: number; year: number }
    >({
      query: ({ userId, month, year }) => ({
        url: `users/${userId}/dashboard/total-transaction-details-by-month?month=${month}&year=${year}`,
      }),
      providesTags: ['User'],
    }),

    // get dashboard details by year
    getDashboardDetailsByYear: builder.query<
      IDataRes<IExpenseIncomeStatistics>,
      { userId: number; year: number }
    >({
      query: ({ userId, year }) => ({
        url: `users/${userId}/dashboard/total-transaction-details-by-year?year=${year}`,
        method: 'GET',
      }),
      providesTags: ['User'],

      transformResponse(
        baseQueryReturnValue: IDataRes<IExpenseIncomeStatistics>
      ) {
        const tempData = baseQueryReturnValue;
        const copyData = baseQueryReturnValue.data.totalTransactionData;
        copyData.map((data: any) => {
          data.month = MONTHS[data.month - 1];
        });
        tempData.data.totalTransactionData = copyData;

        return tempData;
      },
    }),

    // put call for reminder
    putReminderData: builder.mutation<
      void,
      {
        userId: number;
        reminderId: number;
        reminderData: IReminderReq;
      }
    >({
      query: ({ reminderData, userId, reminderId }) => ({
        url: `users/${userId}/reminder/${reminderId}`,
        method: 'PUT',
        data: reminderData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetCategoryItemQuery,
  useGetIncomeExpenseDataQuery,
  usePostIncomeExpenseDataMutation,
  useDeleteIncomeExpenseDataMutation,
  useEditIncomeExpenseDataMutation,
  useUpdateUserPasswordMutation,
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
  useUpdateUserProfileMutation,
  useGetTransactionDataQuery,
  useLazyGetTransactionDataQuery,
  useGetDashboardDetailsByMonthQuery,
  useGetDashboardDetailsByYearQuery,
  useLazyGetTransactionDetailsQuery,
  useGetTransactionDetailsQuery,
  useGetReminderByIdQuery,
  useGetAlertItemQuery,
  usePostReminderDataMutation,
  useLazyGetReminderListQuery,
  useGetReminderListQuery,
  useLazyGetReminderByIdQuery,
  useDeleteReminderMutation,
  useGetReminderCountByMonthQuery,
  useLazyGetReminderCountByMonthQuery,
  usePutReminderDataMutation,
} = userApi;
