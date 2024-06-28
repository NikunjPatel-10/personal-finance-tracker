export const IncomeExpenseValidationMessages = {
  REQUIRED: 'This field is Required',
  DESCRIPTION_MIN_MAX: 'Description must be between 0-30 characters',
  DESCRIPTION_INVALID: 'Description should be alphanumeric characters',
  AMOUNT_INVALID:
    'Enter a valid number: max 8 digits before and 2 digits after the decimal',
};

export const IncomeExpenseValidationRegex = {
  ALPHANUMERIC_CHARACTERS: /^[a-zA-Z0-9 ]+$/,
  NUMBERS_WITH_ONE_DECIMAL: /^\d{1,8}(\.\d{1,2})?$/,
};

export const IncomeExpenseInitialValues = {
  categoryId: '',
  amount: '',
  transactionDate: '',
  description: '',
};

export const Title = {
  ADD_EXPENSE: 'Add Expense',
  ADD_INCOME: 'Add Income',
  EDIT_INCOME: 'Edit Income',
  EDIT_EXPENSE: 'Edit Expense',
};

export const IncomeExpenseFormConstants = {
  SUCCESS_TOASTER: 'Saved Successfully',
};
