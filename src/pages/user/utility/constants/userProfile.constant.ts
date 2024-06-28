const userProfileValidationMessages = {
  lastNameInvalid: 'Please enter a valid Last Name',
  lastNameMinMax: 'Enter Last Name between 2 to 30 Characters',
  phoneNumberInvalid: 'Please enter a Numeric Value',
  phoneNumberMinMax: '10-digit number is required',
  profileImageFormatInvalid:
    'Upload valid Image, Only .JPG, .JPEG and .PNG are allowed',
  profileImageSizeInvalid: 'Image size upto 1 mb is only allowed',
  addressInvalid: 'The Maximum size of this field is 250 Characters',
  pinCodeMinMax: '6 digit pin-code is required',
  pinCodeInvalid: 'Enter a valid pin-code',
};
const userProfileSuccessToaster = {
  successToaster: 'Details successfully saved',
};
const userProfileInitialValues = {
  firstName: '',
  lastName: '',
  genderId: 0,
  phoneNumber: '',
  address: '',
  cityId: 0,
  stateId: 0,
  pincode: '',
  countryId: '',
  image: '',
  dateOfBirth: '',
};
const userProfileValidationRegex = {
  onlyCharacters: /^[a-zA-Z]+$/,
  onlyNumbers: /^\d{10}$/,
  pincodeValidation: /^\d{6}$/,
  onlyStringWithSpace: /^[A-Za-z(,.')?\s-]*$/,
  phoneNumberPattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
};

const userProfileConstants = {
  confirmMessages: {
    submit: 'Are You Sure You Want To Submit The Details?',
    clearAll: 'Are You Sure You Want To Clear All The Details?',
    leave: 'Are You Sure You Want To Leave?',
  },
  buttonText: {
    yes: 'YES',
    no: 'NO',
  },
};

const gender = ['Male', 'Female', 'Other'];
const supported_formates = ['image/jpg', 'image/jpeg', 'image/png'];

const successToaster = 'Profile Picture is Updated Successfully';

export {
  gender,
  successToaster,
  supported_formates,
  userProfileConstants,
  userProfileInitialValues,
  userProfileSuccessToaster,
  userProfileValidationMessages,
  userProfileValidationRegex,
};
