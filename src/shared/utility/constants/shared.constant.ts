export const Constants = {
  END_POINTS: {
    REGISTER: '/users/register',
    REGISTRATION_REQUESTS: 'admin/registration-requests',
    CREATE_USER: 'admin/create-user',
    GET_NOTIFICATION: '/admin/notification',
    UPDATE_NOTIFICATION: '/admin/update-notification',
  },
};

export const UserFormValidationMessages = {
  REQUIRED: 'This field is Required',
  FIRSTNAME_INVALID: 'Please enter a valid First Name',
  FIRSTNAME_MIN_MAX: 'First name must be between 2-30 characters',
  LASTNAME_INVALID: 'Please enter a valid Last Name',
  LASTNAME_MIN_MAX: 'Last name must be between 2-30 characters',
  EMAIL_MIN_MAX: 'Email ID must be between 1-50 characters',
  EMAIL_INVALID: 'Please enter valid Email Id',
  PASSWORD_MIN_MAX: 'Password must be between 8-25 characters',
  PASSWORD_INVALID:
    'At least 1 uppercase alphabet, 1 lowercase alphabet, 1 Special Character (@$!_&*#) and 1 numeric value required',
  CONFIRMPASSWORD_INVALID: 'Password does not match',
  PHONENUMBER_MIN_MAX: '10-digit number is required',
  PHONENUMBER_INVALID: 'Please enter a numeric value only',
};

export const UserFormValidationRegex = {
  ONLY_CHARACTERS: /^[a-zA-Z]+$/,
  ONLY_NUMBERS: /^\d{10}$/,
  ONLY_STRING_WITH_SPACE: /^[A-Za-z(,.')?\s-]*$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!_&*#])(?=.*[0-9]).*$/,
  EMAIL_PATTERN:
    /^(?=.{1,50}$)^[a-zA-Z0-9]+(\.?[a-zA-Z0-9])*@[a-zA-Z0-9]+\.([a-zA-Z]{2,3}|[a-zA-Z]{2}\.[a-zA-Z]{2,3})$/,
  PHONENUMBER_PATTERN:
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
};
