import * as yup from 'yup';
import {
  IncomeExpenseValidationMessages,
  IncomeExpenseValidationRegex,
} from '../constants/incomeExpenseForm.constants';

const incomeExpenseFormValidationSchema = yup.object({
  categoryId: yup.string().required(IncomeExpenseValidationMessages.REQUIRED),
  transactionDate: yup
    .string()
    .required(IncomeExpenseValidationMessages.REQUIRED),
  amount: yup
    .string()
    .matches(
      IncomeExpenseValidationRegex.NUMBERS_WITH_ONE_DECIMAL,
      IncomeExpenseValidationMessages.AMOUNT_INVALID
    )
    .required(IncomeExpenseValidationMessages.REQUIRED),
  description: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .matches(
      IncomeExpenseValidationRegex.ALPHANUMERIC_CHARACTERS,
      IncomeExpenseValidationMessages.DESCRIPTION_INVALID
    )
    .min(0, IncomeExpenseValidationMessages.DESCRIPTION_MIN_MAX)
    .max(30, IncomeExpenseValidationMessages.DESCRIPTION_MIN_MAX),
});

export { incomeExpenseFormValidationSchema };
