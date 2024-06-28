import { Box, Button, Flex, TextInput, Title } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
  CreateUserFormConstants,
  CreateUserInitialValues,
} from '../utility/constants/createUser.constant';
import { ICreateUserForm } from '../utility/models/createUser.model';
import { useCreateUserSubmitMutation } from '../utility/services/admin.service';
import { createUserFormValidationSchema } from '../utility/validations/createUserForm.validation';

interface IProps {
  close: () => void;
}

const CreateUserForm = ({ close }: IProps) => {
  const [createUserSubmit] = useCreateUserSubmitMutation();
  const createUserForm = useForm({
    initialValues: {
      ...CreateUserInitialValues,
    },
    validate: yupResolver(createUserFormValidationSchema),
    validateInputOnChange: false,
  });

  /**
   * This method is called on submit
   * @param values : values for submition
   */
  const handleSubmit = (createUserDeatils: ICreateUserForm) => {
    let signUpSubmitValues = { ...createUserDeatils };
    createUserSubmit(signUpSubmitValues as ICreateUserForm).then(
      (response: any) => {
        if (response.data) {
          if (response.data.message) {
            showNotification({
              title: 'Success',
              message: CreateUserFormConstants.SUCCESS_TOASTER,
              color: 'green',
            });
            createUserForm.reset();
          } else {
            showNotification({
              title: 'Error',
              message: response.data.error,
              color: 'red',
            });
          }
          close();
        }
      }
    );
  };

  const handleCancel = () => {
    createUserForm.reset();
    close();
  };

  const largeScreen = useMediaQuery('(min-width: 1400px)');
  return (
    <Box px={largeScreen ? 10 : 5} py={largeScreen ? 5 : 0}>
      {/* create-user-title  */}
      <Title
        mb={largeScreen ? 'lg' : 'md'}
        style={{ textWrap: 'nowrap', fontWeight: '600', fontSize: '20px' }}
      >
        Create new user
      </Title>
      {/* start create-user-form  */}
      <form onSubmit={createUserForm.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          size={largeScreen ? 'lg' : 'md'}
          mb="sm"
          label="First Name"
          placeholder="First name"
          labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
          key={createUserForm.key('firstName')}
          {...createUserForm.getInputProps('firstName')}
          onBlur={(e) => {
            createUserForm.setFieldValue('firstName', e.target.value.trim());
            createUserForm.validateField('firstName');
          }}
        />
        <TextInput
          size={largeScreen ? 'lg' : 'md'}
          mb="sm"
          label="Last Name"
          placeholder="Last name"
          labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
          key={createUserForm.key('lastName')}
          {...createUserForm.getInputProps('lastName')}
          onBlur={(e) => {
            createUserForm.setFieldValue('lastName', e.target.value.trim());
            createUserForm.validateField('lastName');
          }}
        />
        <TextInput
          withAsterisk
          size={largeScreen ? 'lg' : 'md'}
          mb="xl"
          label="Email ID"
          placeholder="Email ID"
          labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
          key={createUserForm.key('email')}
          {...createUserForm.getInputProps('email')}
          onBlur={(e) => {
            createUserForm.setFieldValue('email', e.target.value.trim());
            createUserForm.validateField('email');
          }}
        />
        <Flex gap={8} justify="end">
          <Button lts="3px" type="submit" size="md">
            CREATE
          </Button>
          <Button
            lts="3px"
            variant="outline"
            type="reset"
            size="md"
            onClick={() => {
              handleCancel();
            }}
          >
            CANCEL
          </Button>
        </Flex>
      </form>
      {/* end create-user-form  */}
    </Box>
  );
};

export default CreateUserForm;
