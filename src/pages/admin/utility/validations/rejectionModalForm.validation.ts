import * as yup from 'yup';
import { RejectionModalFormValidationMessages } from '../constants/admin.constant';

export const rejectionModalFormValidationSchema = yup.object({
  rejectionReason: yup
    .string()
    .min(2, RejectionModalFormValidationMessages.REJECTION_REASON_MIN_MAX)
    .max(255, RejectionModalFormValidationMessages.REJECTION_REASON_MIN_MAX)
    .required(RejectionModalFormValidationMessages.REQUIRED),
});
