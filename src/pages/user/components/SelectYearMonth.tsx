import { Select } from '@mantine/core';
import {
  DASHBOARD_MONTHS,
  INCOME_EXPENSE,
  MONTHS,
  YEARS,
} from '../utility/constants/user.constant';

interface IProps {
  selectedYear: string;
  selectedMonth: string;
  page: string;
  handleYearChange: (value: any) => void;
  handleMonthChange: (value: any) => void;
}

export const SelectYearMonth = ({
  selectedYear,
  selectedMonth,
  handleYearChange,
  handleMonthChange,
  page,
}: IProps) => {
  return (
    <>
      <Select
        withCheckIcon={false}
        allowDeselect={false}
        placeholder="Year"
        data={YEARS}
        value={selectedYear}
        onChange={handleYearChange}
        style={{ width: '120px' }}
      />
      <Select
        withCheckIcon={false}
        allowDeselect={false}
        placeholder="Month"
        styles={{ dropdown: { height: 'fit-content' } }}
        data={page === INCOME_EXPENSE ? MONTHS : DASHBOARD_MONTHS}
        value={selectedMonth}
        onChange={handleMonthChange}
        style={{ width: '120px' }}
      />
    </>
  );
};
