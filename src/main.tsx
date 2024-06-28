import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import '@mantine/charts/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Provider } from 'react-redux';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import AppShell from './AppShell.tsx';
import AuthCallback from './core/components/auth/AuthCallback.tsx';
import SignUp from './core/components/authentication/Sign Up/SignUp.tsx';
import { resolver, theme } from './core/utility/constants/core.constant.ts';
import { PftRoutes } from './core/utility/enums/core.enum.ts';
import './index.css';
import { PageNotFound } from './pages/PageNotFound.tsx';
import ApprovedRequests from './pages/admin/components/ApprovedRequests.tsx';
import PendingRequests from './pages/admin/components/PendingRequests.tsx';
import RejectedRequests from './pages/admin/components/RejectedRequests.tsx';
import User from './pages/user/User.tsx';
import { ReminderCalendar } from './pages/user/components/calendar/ReminderCalendar.tsx';
import Dashboard from './pages/user/components/dashboard/Dashboard.tsx';
import Expense from './pages/user/components/expense/Expense.tsx';
import Income from './pages/user/components/income/Income.tsx';
import Transactions from './pages/user/components/transaction/Transactions.tsx';
import AdminProtectedRoutes from './routes/AdminProtectedRoutes.tsx';
import PublicRoutes from './routes/PublicRoutes.tsx';
import { store } from './store/store.ts';
import UserReports from './pages/admin/components/userReport/UserReports.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <User />,
        children: [
          {
            path: '',
            element: <Navigate to={PftRoutes.DASHBOARD} />,
          },
          {
            path: PftRoutes.DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: PftRoutes.TRANSACTIONS,
            element: <Transactions />,
          },
          {
            path: PftRoutes.EXPENSE,
            element: <Expense />,
          },
          {
            path: PftRoutes.INCOME,
            element: <Income />,
          },
          {
            path: PftRoutes.CALENDAR,
            element: <ReminderCalendar />,
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminProtectedRoutes />,
    children: [
      {
        path: '',
        element: <Navigate to={PftRoutes.PENDING_REQUESTS} />,
      },
      {
        path: PftRoutes.PENDING_REQUESTS,
        element: <PendingRequests />,
      },
      {
        path: PftRoutes.APPROVED_REQUESTS,
        element: <ApprovedRequests />,
      },
      {
        path: PftRoutes.REJECTED_REQUESTS,
        element: <RejectedRequests />,
      },
      {
        path: PftRoutes.USER_REPORTS,
        element: <UserReports />,
      },
    ],
  },
  {
    path: '/sign-up',
    element: <PublicRoutes Component={SignUp} />,
  },
  {
    path: '/callback',
    element: <AuthCallback />,
  },
  {
    path: '/unauthorize',
    element: <PageNotFound type="unauthorize" />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme} cssVariablesResolver={resolver}>
        <AppShell />
        <RouterProvider router={router} />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
