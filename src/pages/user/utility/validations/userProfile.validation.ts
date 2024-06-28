import * as yup from 'yup';
import {
  userProfileValidationMessages,
  userProfileValidationRegex,
} from '../constants/userProfile.constant';

export const userProfileValidationSchema = yup.object({
  lastName: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .min(2, userProfileValidationMessages.lastNameMinMax)
    .max(30, userProfileValidationMessages.lastNameMinMax)
    .matches(
      userProfileValidationRegex.onlyCharacters,
      userProfileValidationMessages.lastNameInvalid
    ),
  phoneNumber: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .matches(
      userProfileValidationRegex.phoneNumberPattern,
      userProfileValidationMessages.phoneNumberInvalid
    )
    .matches(
      userProfileValidationRegex.onlyNumbers,
      userProfileValidationMessages.phoneNumberMinMax
    ),
  address: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .max(250, userProfileValidationMessages.addressInvalid),
  pincode: yup
    .string()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .matches(
      userProfileValidationRegex.pincodeValidation,
      userProfileValidationMessages.pinCodeMinMax
    ),
});
