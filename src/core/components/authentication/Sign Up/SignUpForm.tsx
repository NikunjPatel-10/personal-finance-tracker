import {
  Anchor,
  Box,
  Button,
  Flex,
  NumberInput,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import { SignUpInitialValues } from '../../../utility/constants/SignUp.constant';
import {
  ISignUpForm,
  ISignUpFormProps,
} from '../../../utility/models/signUp.model';
import { login } from '../../../utility/services/auth-service';
import { signUpFormValidationSchema } from '../../../utility/validations/signUp.validation';

export const SignUpForm: React.FC<ISignUpFormProps> = ({
  onSignUpSubmit,
  resetForm,
}) => {
  useEffect(() => {
    if (resetForm) {
      signUpForm.reset();
    }
  }, [resetForm]);

  const signUpForm = useForm({
    initialValues: {
      ...SignUpInitialValues,
    },
    validate: yupResolver(signUpFormValidationSchema),
    validateInputOnChange: false,
    validateInputOnBlur: true,
  });
  /**
   * This method is called on submit
   * @param values : values for submition
   */
  const handleSubmit = (values: ISignUpForm) => {
    let signUpSubmitValues = { ...values };
    delete signUpSubmitValues.confirmPassword;
    signUpSubmitValues.phoneNumber = signUpSubmitValues.phoneNumber.toString();
    onSignUpSubmit(signUpSubmitValues);
  };

  const largeScreen = useMediaQuery('(min-width: 1400px)');
  return (
    <Box px={largeScreen ? 70 : 50} py={largeScreen ? 30 : 20} w={'50%'}>
      {/* Sign-up title  */}
      <Title order={2} mb={largeScreen ? 'lg' : 'md'}>
        Sign Up
      </Title>

      {/* Start: Sign-up form  */}
      <form onSubmit={signUpForm.onSubmit(handleSubmit)}>
        <Flex gap={20} mb="sm">
          <TextInput
            withAsterisk
            size={largeScreen ? 'lg' : 'md'}
            leftSection={<span className="icon icon-user" />}
            label="First Name"
            placeholder="First name"
            labelProps={{ style: { fontSize: '14px' } }}
            {...signUpForm.getInputProps('firstName')}
            onBlur={(e) => {
              signUpForm.setFieldValue('firstName', e.target.value.trim());
              signUpForm.validateField('firstName');
            }}
          />

          <TextInput
            size={largeScreen ? 'lg' : 'md'}
            leftSection={<span className="icon icon-user" />}
            label="Last Name"
            placeholder="Last name"
            labelProps={{ style: { fontSize: '14px' } }}
            {...signUpForm.getInputProps('lastName')}
            onBlur={(e) => {
              signUpForm.setFieldValue('lastName', e.target.value.trim());
              signUpForm.validateField('lastName');
            }}
          />
        </Flex>
        <NumberInput
          hideControls
          size={largeScreen ? 'lg' : 'md'}
          maxLength={10}
          mb="sm"
          leftSection={<span className="icon icon-phone" />}
          label="Phone"
          placeholder="Phone"
          labelProps={{ style: { fontSize: '14px' } }}
          {...signUpForm.getInputProps('phoneNumber')}
        />
        <TextInput
          withAsterisk
          size={largeScreen ? 'lg' : 'md'}
          mb="sm"
          leftSection={<span className="icon icon-email" />}
          label="Email ID"
          placeholder="Email ID"
          labelProps={{ style: { fontSize: '14px' } }}
          {...signUpForm.getInputProps('email')}
          onBlur={(e) => {
            signUpForm.setFieldValue('email', e.target.value.trim());
            signUpForm.validateField('email');
          }}
        />
        <PasswordInput
          withAsterisk
          size={largeScreen ? 'lg' : 'md'}
          mb="sm"
          leftSection={<span className="icon icon-password" />}
          label="Password"
          placeholder="Password"
          labelProps={{ style: { fontSize: '14px' } }}
          {...signUpForm.getInputProps('passwordHash')}
          onBlur={(e: any) => {
            signUpForm.validateField('passwordHash');
            if (
              signUpForm.getValues().confirmPassword.length > 0 &&
              (e.target.value || signUpForm.isTouched('passwordHash'))
            ) {
              signUpForm.validateField('confirmPassword');
            }
          }}
        />
        <PasswordInput
          withAsterisk
          size={largeScreen ? 'lg' : 'md'}
          mb="lg"
          leftSection={<span className="icon icon-password" />}
          label="Confirm Password"
          placeholder="Confirm Password"
          labelProps={{ style: { fontSize: '14px' } }}
          {...signUpForm.getInputProps('confirmPassword')}
        />
        <Button fullWidth size={largeScreen ? 'lg' : 'md'} type="submit">
          SUBMIT
        </Button>
      </form>
      {/* End: Sign-up form  */}

      <Flex justify="center" mt={largeScreen ? 'lg' : 'sm'}>
        {/* Redirection link text */}
        <Text c="var(--mantine-color-grey)" pr="3px">
          Already have an account?
        </Text>
        {/* Redirection link */}
        <Anchor fw={700} underline="never" onClick={() => login()}>
          Sign in Here
        </Anchor>
      </Flex>
    </Box>
  );
};
