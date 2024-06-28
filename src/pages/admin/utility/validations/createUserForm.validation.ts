import * as yup from 'yup';
import {
  UserFormValidationMessages,
  UserFormValidationRegex,
} from '../../../../shared/utility/constants/shared.constant';

const createUserFormValidationSchema = yup.object({
  firstName: yup
    .string()
    .min(2, UserFormValidationMessages.FIRSTNAME_MIN_MAX)
    .max(30, UserFormValidationMessages.FIRSTNAME_MIN_MAX)
    .matches(
      UserFormValidationRegex.ONLY_CHARACTERS,
      UserFormValidationMessages.FIRSTNAME_INVALID
    )
    .required(UserFormValidationMessages.REQUIRED),
  lastName: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(2, UserFormValidationMessages.LASTNAME_MIN_MAX)
    .max(30, UserFormValidationMessages.LASTNAME_MIN_MAX)
    .matches(
      UserFormValidationRegex.ONLY_CHARACTERS,
      UserFormValidationMessages.LASTNAME_INVALID
    ),

  email: yup
    .string()
    .matches(
      UserFormValidationRegex.EMAIL_PATTERN,
      UserFormValidationMessages.EMAIL_INVALID
    )
    .min(1, UserFormValidationMessages.EMAIL_MIN_MAX)
    .max(50, UserFormValidationMessages.EMAIL_MIN_MAX)
    .required(UserFormValidationMessages.REQUIRED),
});

export { createUserFormValidationSchema };
