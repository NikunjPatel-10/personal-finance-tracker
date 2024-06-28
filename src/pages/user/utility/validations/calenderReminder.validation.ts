import * as yup from 'yup';
import {
  ReminderValidationMessages,
  ReminderValidationRegex,
} from '../constants/calender.constant';

const reminderFormValidationSchema = yup.object({
  value: yup
    .string()
    .matches(
      ReminderValidationRegex.NUMBERS_WITH_ONE_DECIMAL,
      ReminderValidationMessages.VALUE_INVALID
    )
    .required(ReminderValidationMessages.REQUIRED),
  title: yup
    .string()
    .min(2, ReminderValidationMessages.TITLE_MIN_MAX)
    .max(50, ReminderValidationMessages.TITLE_MIN_MAX)
    .required(ReminderValidationMessages.REQUIRED),
  reminderDate: yup.string().required(ReminderValidationMessages.REQUIRED),
  reminderAlertId: yup.string().required(ReminderValidationMessages.REQUIRED),
  notes: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(0, ReminderValidationMessages.NOTES_MIN_MAX)
    .max(100, ReminderValidationMessages.NOTES_MIN_MAX),
});

export { reminderFormValidationSchema };
