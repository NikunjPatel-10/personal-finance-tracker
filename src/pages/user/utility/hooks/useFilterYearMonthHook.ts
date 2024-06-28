import { useState } from 'react';
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  MONTHS,
} from '../constants/user.constant';

export const useFilterYearMonth = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    CURRENT_YEAR.toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<any>(
    MONTHS[CURRENT_MONTH]
  );

  // trigger when user select the year
  const handleYearChange = (value: any) => {
    setSelectedYear(value);
  };

  // trigger when user select the month
  const handleMonthChange = (value: any) => {
    setSelectedMonth(value);
  };

  return {
    selectedYear,
    selectedMonth,
    handleYearChange,
    handleMonthChange,
  };
};
