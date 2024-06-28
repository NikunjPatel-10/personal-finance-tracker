export const ChangePasswordFormValidationMessages = {
  REQUIRED: 'This field is Required',
  PASSWORD_MIN_MAX: 'Password must be between 8-25 characters',
  PASSWORD_INVALID:
    'At least 1 uppercase alphabet, 1 lowercase alphabet, 1 Special Character (@$!_&*#) and 1 numeric value required',
  CONFIRMPASSWORD_INVALID: 'Password does not match',
  NEWPASSWORD_INVALID: 'Old password and new password must not be same',
};

export const ChangePasswordInitialValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const ChangePasswordFormConstants = {
  CONFIRM_MESSAGES: {
    LEAVE: 'Are You Sure You Want To Leave?',
    CLEAR_ALL: 'Are You Sure You Want To Clear All The Details?',
    SUBMIT: 'Are You Sure You Want To Submit The Details?',
  },
  BUTTON_TEXT: {
    YES: 'YES',
    NO: 'NO',
  },
};
