import { getMonth, getYear } from 'date-fns';
import { PftRoutes } from '../../../../core/utility/enums/core.enum';

export const CURRENT_YEAR = getYear(new Date());
export const CURRENT_MONTH = getMonth(new Date());
export const DASHBOARD_CURRENT_MONTH = getMonth(new Date()) + 1;

export const SidebarListItem = [
  {
    icon: 'icon-dashboard',
    redirectTo: PftRoutes.DASHBOARD,
    label: 'Dashboard',
  },
  {
    icon: 'icon-transactions',
    redirectTo: PftRoutes.TRANSACTIONS,
    label: 'Transactions',
  },
  {
    icon: 'icon-income',
    redirectTo: PftRoutes.INCOME,
    label: 'Income',
  },
  {
    icon: 'icon-expenses',
    redirectTo: PftRoutes.EXPENSE,
    label: 'Expense',
  },
  {
    icon: 'icon-date',
    redirectTo: PftRoutes.CALENDAR,
    label: 'Calendar',
  },
];

export const CategoryType = {
  EXPENSE: 'Expense',
  INCOME: 'Income',
  TRANSACTIONS: 'Transactions',
};

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DASHBOARD_MONTHS = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DeleteTransactionModel = {
  CONFIRM_MESSAGES: {
    DELETE: 'Are you sure you want to delete this?',
  },
  BUTTON_TEXT: {
    YES: 'YES',
    NO: 'NO',
  },
};

const YearsInNumber = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export const YEARS = YearsInNumber.map((year) => year.toString());

export const PAGE_SIZE = 10;

export const INCOME_EXPENSE = 'income-expense';

/** category colors for donut chart */
export const CATEGORY_COLORS: any = {
  1: '#248E44',
  2: '#5ebe7b',
  3: '#8694AA',
  4: '#A1BCE3',
  5: '#2560B6',
  6: '#0284FF',
  7: '#80A8E5',
  8: '#EC7A23',
  9: '#EE9E61',
  10: '#F9CBA7',
  11: '#e05151',
  12: '#ce7474',
  13: '#d39f9f',
};

/** series for stacked bar chart */
export const CHART_SERIES = [
  {
    name: 'totalIncome',
    label: 'Total Income',
    color: '#58A65F',
  },
  {
    name: 'totalExpenses',
    label: 'Total Expense',
    color: '#EC7A23',
  },
  {
    name: 'availableBalance',
    label: 'Available Balance',
    color: '#004170',
  },
];
export const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
