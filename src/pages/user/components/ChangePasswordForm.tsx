import { Box, Button, Drawer, Group, PasswordInput, Text } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import deepEqual from 'deep-equal';
import { useState } from 'react';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { useAppSelector } from '../../../store/store';
import {
  ChangePasswordFormConstants,
  ChangePasswordInitialValues,
} from '../utility/constants/changePasswordForm.constant';
import { IChangePasswordReq } from '../utility/models/user.model';
import { useUpdateUserPasswordMutation } from '../utility/services/user.service';
import { changePasswordFormValidationSchema } from '../utility/validations/changePasswordForm.validation';
interface IProps {
  opened: boolean;
  close: () => void;
}
export const ChangePasswordForm = ({ opened, close }: IProps) => {
  const largeScreen = useMediaQuery('(min-width: 1600px)');
  const [formData, setFormData] = useState<IChangePasswordReq>();
  const subjectId = localStorage.getItem('subjectId');
  const [updatePassword] = useUpdateUserPasswordMutation();
  const userEmail = useAppSelector((state: any) => state.auth.user.emailId);

  const [crossModalOpened, { open: openCrossModal, close: closeCrossModal }] =
    useDisclosure(false);
  const [
    clearAllModalOpened,
    { open: openclearAllModal, close: closeClearAllModal },
  ] = useDisclosure(false);
  const [
    submitModalOpened,
    { open: openSubmitModal, close: closeSubmitModal },
  ] = useDisclosure(false);

  // trigger when user click on cross modal YES button
  const handleCrossYesButton = () => {
    closeCrossModal();
    close();
  };

  // trigger when user click on clear all modal YES button
  const handleClearAllYesButton = () => {
    changePasswordForm.reset();
    closeClearAllModal();
  };

  // trigger when user submit the form
  const handleSubmitButton = (values: IChangePasswordReq) => {
    setFormData(values);
    openSubmitModal();
  };

  //trigger when user click on submit modal YES button
  const handleSubmitYesButton = () => {
    if (formData && subjectId) {
      updatePassword({ subjectId: subjectId, userPasswordData: formData }).then(
        (res: any) => {
          if ('data' in res) {
            if (res.data) {
              showNotification({
                title: 'Success',
                message: res.data.message,
                color: 'green',
              });
              close();
            } else {
              closeSubmitModal();
              showNotification({
                title: 'Error',
                message: res.data.error,
                color: 'red',
              });
            }
          }
        }
      );
    }
  };

  const changePasswordForm = useForm({
    initialValues: { ...ChangePasswordInitialValues },
    validate: yupResolver(changePasswordFormValidationSchema),
    validateInputOnChange: false,
    validateInputOnBlur: true,
  });

  return (
    <>
      <Drawer
        opened={opened}
        onClose={
          deepEqual(ChangePasswordInitialValues, changePasswordForm.values)
            ? close
            : openCrossModal
        }
        zIndex={999}
        position="right"
        title="Change Password"
        closeButtonProps={{
          icon: (
            <Text
              component="span"
              className="icon-close"
              c="var(--mantine-color-grey)"
              onClick={
                deepEqual(
                  ChangePasswordInitialValues,
                  changePasswordForm.values
                )
                  ? close
                  : openCrossModal
              }
            ></Text>
          ),
        }}
        styles={{
          title: { fontSize: '20px', fontWeight: '700' },
          header: { padding: '20px', borderBottom: '1px solid #80808030' },
          content: {
            display: 'flex',
            flexDirection: 'column',
            flex: largeScreen ? '0 0 500px' : '0 0 455px',
          },
          body: { padding: '0px', flexGrow: 1 },
        }}
        overlayProps={{
          blur: 3,
          backgroundOpacity: 0.5,
        }}
      >
        {/* start: form */}
        <form
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          onSubmit={changePasswordForm.onSubmit(handleSubmitButton)}
        >
          <Box px={'xl'} py="24px" style={{ flexGrow: 1 }}>
            {/* start: strong password message */}
            <Box>
              <Text fw={600} mb="xs">
                Strong password required.
              </Text>
              <Text size="sm" mb={'3px'}>
                <span
                  className="icon-exclamation"
                  style={{ marginRight: '8px', color: '#8694AA' }}
                ></span>
                <span>Must be at least 8 to 25 characters long</span>
              </Text>
              <Text size="sm" mb={'3px'}>
                <span
                  className="icon-exclamation"
                  style={{ marginRight: '8px', color: '#8694AA' }}
                ></span>
                <span>
                  Must contain an uppercase and a lowercase letter (A,z)
                </span>
              </Text>
              <Text size="sm" mb={'3px'}>
                <span
                  className="icon-exclamation"
                  style={{ marginRight: '8px', color: '#8694AA' }}
                ></span>
                <span>Must contain a number</span>
              </Text>
              <Text size="sm" mb={'3px'}>
                <span
                  className="icon-exclamation"
                  style={{ marginRight: '8px', color: '#8694AA' }}
                ></span>
                <span>
                  Must contain a special character (!, %, @, #, etc.){' '}
                </span>
              </Text>
            </Box>
            {/* end: strong password message */}
            {/* start: user id text */}
            <Box py={'sm'}>
              <Text fw={600}>User ID</Text>
              <Text>{userEmail}</Text>
            </Box>
            {/* end: user id text */}
            {/* start: password input fields */}
            <Box>
              <PasswordInput
                withAsterisk
                label="Old Password"
                placeholder="Old Password"
                radius="sm"
                mb="10px"
                w="100%"
                size="md"
                styles={{
                  label: {
                    fontWeight: '600',
                    fontSize: '14px',
                    marginBottom: '4px',
                  },
                }}
                {...changePasswordForm.getInputProps('oldPassword')}
                onBlur={(e: any) => {
                  changePasswordForm.validateField('oldPassword');
                  if (
                    changePasswordForm.getValues().newPassword.length > 0 &&
                    (e.target.value ||
                      changePasswordForm.isTouched('oldPassword'))
                  ) {
                    changePasswordForm.validateField('newPassword');
                  }
                }}
              />
              <PasswordInput
                withAsterisk
                label="Create New Password"
                placeholder="Create New Password"
                radius="sm"
                mb="10px"
                w="100%"
                size="md"
                styles={{
                  label: {
                    fontWeight: '600',
                    fontSize: '14px',
                    marginBottom: '4px',
                  },
                }}
                {...changePasswordForm.getInputProps('newPassword')}
                onBlur={(e: any) => {
                  changePasswordForm.validateField('newPassword');
                  if (
                    changePasswordForm.getValues().confirmPassword.length > 0 &&
                    (e.target.value ||
                      changePasswordForm.isTouched('newPassword'))
                  ) {
                    changePasswordForm.validateField('confirmPassword');
                  }
                }}
              />
              <PasswordInput
                withAsterisk
                label="Confirm New Password"
                placeholder="Confirm New Password"
                radius="sm"
                w="100%"
                size="md"
                styles={{
                  label: {
                    fontWeight: '600',
                    fontSize: '14px',
                    marginBottom: '4px',
                  },
                }}
                {...changePasswordForm.getInputProps('confirmPassword')}
              />
            </Box>
            {/* end: password input fields */}
          </Box>
          {/* start: button group */}
          <Group
            justify="flex-end"
            p={'md'}
            style={{ borderTop: '1px solid #80808030' }}
          >
            <Button type="submit" radius="xs" fw={500} lts={2}>
              SUBMIT
            </Button>
            <Button
              radius="xs"
              fw={500}
              lts={2}
              color="var(--mantine-color-grey)"
              onClick={openclearAllModal}
            >
              CLEAR ALL
            </Button>
          </Group>
          {/* end: button group */}
        </form>
        {/* end: form */}
      </Drawer>
      {/* confirmaton modal for cross icon */}
      {crossModalOpened && (
        <ConfirmationModal
          opened={crossModalOpened}
          confirmationMessage={
            ChangePasswordFormConstants.CONFIRM_MESSAGES.LEAVE
          }
          positiveButtonText={ChangePasswordFormConstants.BUTTON_TEXT.YES}
          negativeButtonText={ChangePasswordFormConstants.BUTTON_TEXT.NO}
          handlePositiveButton={handleCrossYesButton}
          handleNegativeButton={closeCrossModal}
        />
      )}
      {/* confirmaton modal for clear all button */}
      {clearAllModalOpened && (
        <ConfirmationModal
          opened={clearAllModalOpened}
          confirmationMessage={
            ChangePasswordFormConstants.CONFIRM_MESSAGES.CLEAR_ALL
          }
          positiveButtonText={ChangePasswordFormConstants.BUTTON_TEXT.YES}
          negativeButtonText={ChangePasswordFormConstants.BUTTON_TEXT.NO}
          handlePositiveButton={handleClearAllYesButton}
          handleNegativeButton={closeClearAllModal}
        />
      )}
      {/* confirmaton modal for submit button */}
      {submitModalOpened && (
        <ConfirmationModal
          opened={submitModalOpened}
          confirmationMessage={
            ChangePasswordFormConstants.CONFIRM_MESSAGES.SUBMIT
          }
          positiveButtonText={ChangePasswordFormConstants.BUTTON_TEXT.YES}
          negativeButtonText={ChangePasswordFormConstants.BUTTON_TEXT.NO}
          handlePositiveButton={handleSubmitYesButton}
          handleNegativeButton={closeSubmitModal}
        />
      )}
    </>
  );
};
