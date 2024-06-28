import * as yup from 'yup';
import { UserFormValidationRegex } from '../../../../shared/utility/constants/shared.constant';
import { ChangePasswordFormValidationMessages } from '../constants/changePasswordForm.constant';

export const changePasswordFormValidationSchema = yup.object({
  oldPassword: yup
    .string()
    .min(8, ChangePasswordFormValidationMessages.PASSWORD_MIN_MAX)
    .max(25, ChangePasswordFormValidationMessages.PASSWORD_MIN_MAX)
    .matches(
      UserFormValidationRegex.PASSWORD_PATTERN,
      ChangePasswordFormValidationMessages.PASSWORD_INVALID
    )
    .required(ChangePasswordFormValidationMessages.REQUIRED),
  newPassword: yup
    .string()
    .test(
      'passwords-match',
      ChangePasswordFormValidationMessages.NEWPASSWORD_INVALID,
      function (value) {
        return this.parent.oldPassword !== value;
      }
    )
    .min(8, ChangePasswordFormValidationMessages.PASSWORD_MIN_MAX)
    .max(25, ChangePasswordFormValidationMessages.PASSWORD_MIN_MAX)
    .matches(
      UserFormValidationRegex.PASSWORD_PATTERN,
      ChangePasswordFormValidationMessages.PASSWORD_INVALID
    )
    .required(ChangePasswordFormValidationMessages.REQUIRED),
  confirmPassword: yup
    .string()
    .test(
      'passwords-match',
      ChangePasswordFormValidationMessages.CONFIRMPASSWORD_INVALID,
      function (value) {
        return this.parent.newPassword === value;
      }
    )
    .required(ChangePasswordFormValidationMessages.REQUIRED),
});
