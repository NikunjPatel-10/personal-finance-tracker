import { Box, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { ConfirmationModal } from '../../../../shared/components/ConfirmationModal';
import { useAppSelector } from '../../../../store/store';
import {
  DeleteReminderModalConstants,
  ReminderFormConstants,
} from '../../utility/constants/calender.constant';
import {
  IReminderDetails,
  IReminderListItem,
} from '../../utility/models/user.model';
import {
  useDeleteReminderMutation,
  useLazyGetReminderByIdQuery,
} from '../../utility/services/user.service';
import deleteImage from './../../../../assets/images/delete-img.svg';
import { ReminderDetails } from './ReminderDetails';
import ReminderForm from './ReminderForm';

interface IProps {
  reminderList?: IReminderListItem[];
  reminderDate: Date | undefined | null;
}
export const Reminder = ({ reminderList, reminderDate }: IProps) => {
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteConfirmationModalopened,
    { open: openDeleteConfirmationModal, close: closeDeleteConfirmationModal },
  ] = useDisclosure(false);
  const [editReminderId, setEditReminderId] = useState<number>(0);
  const [deleteReminderId, setDeleteReminderId] = useState<number>(0);
  const [reminderId, setReminderId] = useState<number>(0);
  const [getReminderDetailTrigger] = useLazyGetReminderByIdQuery();
  const [deleteReminder] = useDeleteReminderMutation();
  const onEditReminder = (reminderId: number) => {
    setEditReminderId(reminderId);
    //api call
    getReminderDetailTrigger({
      userId,
      reminderId,
    }).then((res: any) => {
      if (res.data) {
        setGetByIdData(res.data.data);
      }
    });
    openEditReminderModal();
  };
  const [getByIdData, setGetByIdData] = useState<IReminderDetails>();
  const [
    editReminderModalOpened,
    { open: openEditReminderModal, close: closeEditReminderModal },
  ] = useDisclosure(false);

  // Trigger when click on the delete icon
  const onDeleteReminder = (reminderId: number) => {
    openDeleteConfirmationModal();
    setDeleteReminderId(reminderId);
  };
  const largeScreen = useMediaQuery('(min-width: 1600px)');

  // Trigger when user click on YES button to delete the reminder
  const handleDeleteYesButton = () => {
    deleteReminder({ userId: userId, reminderId: deleteReminderId }).then(
      (res: any) => {
        if ('data' in res) {
          if (res.data) {
            showNotification({
              title: 'Success',
              message: res.data.message,
              color: 'green',
            });
            closeDeleteConfirmationModal();
          } else {
            closeDeleteConfirmationModal();
            showNotification({
              title: 'Error',
              message: res.data.error,
              color: 'red',
            });
          }
        }
      }
    );
  };

  // trigger when user click on reminder list
  const handleReminderClick = (reminderId: number) => {
    open();
    setReminderId(reminderId);
  };

  return (
    <>
      <Box
        px={largeScreen ? '26px' : '16px'}
        style={{
          overflow: 'auto',
        }}
      >
        {reminderList?.length ? (
          reminderList.map((reminder, index) => (
            <Flex
              h={'60px'}
              w={'100%'}
              mt={'20px'}
              className="cp"
              key={index}
              onClick={() => handleReminderClick(reminder.reminderId)}
            >
              <Box bg={'white'} m="auto 15px auto 0px" miw={'60px'}>
                <Text c={'#202224'} size="12px" fw={600} opacity={'80%'}>
                  {reminder.reminderTime}
                </Text>
              </Box>
              <Flex
                align="center"
                justify={'space-between'}
                p={largeScreen ? 20 : 16}
                style={{
                  borderRadius: '4px',
                  flexGrow: 1,
                  backgroundColor: `rgba(40, 128, 252, 0.04)`,
                  borderLeft: '3px solid #2880FC',
                }}
              >
                <Text
                  c={'#031837'}
                  fz="14px"
                  fw={700}
                  me={'20px'}
                  maw={80}
                  style={{
                    textWrap: 'wrap',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={reminder.title}
                >
                  {reminder.title}
                </Text>
                {/* start: icon-wrapper */}
                <Box onClick={(event) => event.stopPropagation()}>
                  <span
                    className="icon-edit cp"
                    style={{
                      fontSize: largeScreen ? 20 : 16,
                      color: '#8694AA',
                      marginRight: '16px',
                    }}
                    onClick={() => onEditReminder(reminder.reminderId)}
                  ></span>
                  <span
                    className="icon-delete cp"
                    style={{
                      fontSize: largeScreen ? 20 : 16,
                      color: '#8694AA',
                    }}
                    onClick={() => onDeleteReminder(reminder.reminderId)}
                  ></span>
                </Box>
                {/* end: icon-wrapper */}
              </Flex>
            </Flex>
          ))
        ) : (
          <Text>No Reminders</Text>
        )}
      </Box>

      {/* start: Reminder Details modal */}
      {opened && (
        <Modal
          opened
          onClose={close}
          title="Reminder Details"
          padding={'20px'}
          centered
          size={'508px'}
          radius={'10px'}
          trapFocus={false}
          closeButtonProps={{
            icon: (
              <Text
                component="span"
                size="20px"
                className="icon-close"
                c="var(--mantine-color-grey)"
                onClick={close}
              ></Text>
            ),
          }}
          styles={{ title: { fontSize: '24px', fontWeight: 700 } }}
        >
          <ReminderDetails reminderId={reminderId} />
        </Modal>
      )}
      {/* end: Reminder Details modal */}
      {/* start: Confirmation modal for delete reminder */}
      <ConfirmationModal
        opened={deleteConfirmationModalopened}
        confirmationMessage={DeleteReminderModalConstants.CONFIRM_MESSAGES}
        positiveButtonText={DeleteReminderModalConstants.POSITIVE_BUTTON_TEXT}
        negativeButtonText={DeleteReminderModalConstants.NEGATIVE_BUTTON_TEXT}
        imageSource={deleteImage}
        handlePositiveButton={handleDeleteYesButton}
        handleNegativeButton={closeDeleteConfirmationModal}
      />
      {/* end: Confirmation modal for delete reminder */}

      {/* start: Reminder Edit modal */}
      {editReminderModalOpened && (
        <Modal
          opened={editReminderModalOpened}
          onClose={closeEditReminderModal}
          title={ReminderFormConstants.EDIT_REMINDER.FORM_TITLE}
          padding={'20px'}
          centered
          size={'658px'}
          radius={'10px'}
          trapFocus={false}
          closeButtonProps={{
            icon: (
              <Text
                component="span"
                size="20px"
                className="icon-close"
                c="var(--mantine-color-grey)"
                onClick={closeEditReminderModal}
              ></Text>
            ),
          }}
          styles={{ title: { fontSize: '24px', fontWeight: 700 } }}
        >
          <ReminderForm
            reminderDate={reminderDate}
            close={closeEditReminderModal}
            patchData={getByIdData}
            reminderId={editReminderId}
          />
        </Modal>
      )}
      {/* end: Reminder Edit modal */}
    </>
  );
};
