import * as yup from 'yup';
import {
  UserFormValidationMessages,
  UserFormValidationRegex,
} from '../../../shared/utility/constants/shared.constant';

const signUpFormValidationSchema = yup.object({
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

  phoneNumber: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .matches(
      UserFormValidationRegex.PHONENUMBER_PATTERN,
      UserFormValidationMessages.PHONENUMBER_INVALID
    )
    .matches(
      UserFormValidationRegex.ONLY_NUMBERS,
      UserFormValidationMessages.PHONENUMBER_MIN_MAX
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
  passwordHash: yup
    .string()
    .min(8, UserFormValidationMessages.PASSWORD_MIN_MAX)
    .max(25, UserFormValidationMessages.PASSWORD_MIN_MAX)
    .matches(
      UserFormValidationRegex.PASSWORD_PATTERN,
      UserFormValidationMessages.PASSWORD_INVALID
    )
    .required(UserFormValidationMessages.REQUIRED),
  confirmPassword: yup
    .string()
    .test(
      'passwords-match',
      UserFormValidationMessages.CONFIRMPASSWORD_INVALID,
      function (value) {
        return this.parent.passwordHash === value;
      }
    )
    .required(UserFormValidationMessages.REQUIRED),
});

export { signUpFormValidationSchema };
