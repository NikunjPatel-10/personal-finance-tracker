import { Container, Flex } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { SignUpFormConstants } from '../../../utility/constants/SignUp.constant';
import { ISignUpForm } from '../../../utility/models/signUp.model';
import { useSignUpSubmitMutation } from '../../../utility/services/signUp.service';
import SignUpBg from './SignUpBg';
import { SignUpForm } from './SignUpForm';
import { login } from '../../../utility/services/auth-service';

export default function SignUp() {
  const [signUpSubmit] = useSignUpSubmitMutation();
  const [resetForm, setResetForm] = useState<boolean>(false);

  const handleSignUpSubmit = (signUpDetails: ISignUpForm) => {
    signUpSubmit(signUpDetails as ISignUpForm).then((response: any) => {
      if ('data' in response) {
        if (response.data.message) {
          showNotification({
            title: 'Success',
            message: SignUpFormConstants.SUCCESS_TOASTER,
            color: 'green',
          });
          setResetForm(true);
          setTimeout(() => {
            login();
          }, 3000);
        } else {
          showNotification({
            title: 'Error',
            message: response.data.error,
            color: 'red',
          });
          setResetForm(false);
        }
      }
    });
  };
  return (
    <Flex h="100%" style={{ flexDirection: 'column' }}>
      <Flex align="center" justify="center" style={{ flexGrow: 1 }} p="md">
        <Container size="60rem" display="flex" style={{ alignItems: 'center' }}>
          <Flex style={{ borderRadius: '10px' }} w={'100%'} bg="white">
            <SignUpBg />
            <SignUpForm
              onSignUpSubmit={handleSignUpSubmit}
              resetForm={resetForm}
            />
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
}
