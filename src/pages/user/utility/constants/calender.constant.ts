export const ReminderFormConstants = {
  ADD_REMINDER: {
    FORM_TITLE: 'Set Reminder',
  },
  EDIT_REMINDER: {
    FORM_TITLE: 'Edit Reminder',
  },
};
export const ReminderInitialValues = {
  value: '',
  title: '',
  reminderDate: '',
  reminderAlertId: '',
  notes: '',
};

export const ReminderValidationMessages = {
  REQUIRED: 'This field is required',
  TITLE_MIN_MAX: 'Enter Title Between 2 to 50 Characters',
  VALUE_INVALID:
    'Enter a valid number: Max 8 Digits Before And 2 Digits After The Decimal',
  NOTES_MIN_MAX: 'Enter Notes Between 0 to 100 Characters',
};

export const ReminderValidationRegex = {
  NUMBERS_WITH_ONE_DECIMAL: /^\d{1,8}(\.\d{1,2})?$/,
};

export const DeleteReminderModalConstants = {
  CONFIRM_MESSAGES: 'Are you sure you want to delete this?',
  POSITIVE_BUTTON_TEXT: 'YES',
  NEGATIVE_BUTTON_TEXT: 'NO',
};
