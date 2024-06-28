import {
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Text,
  Textarea,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IRejectionModalForm } from '../utility/models/admin.model';
import { usePostApproveRejectUserListMutation } from '../utility/services/admin.service';
import { rejectionModalFormValidationSchema } from '../utility/validations/rejectionModalForm.validation';
import redCrossImage from './../../../assets/images/red-cross.svg';
interface IProps {
  opened: boolean;
  close: () => void;
  adminSelectedData: any;
  setSelectedData: any;
}
export const RejectedModal = ({
  close,
  opened,
  adminSelectedData,
  setSelectedData,
}: IProps) => {
  const [approveUserList] = usePostApproveRejectUserListMutation();
  const rejectionForm = useForm({
    initialValues: {
      rejectionReason: '',
    },
    validate: yupResolver(rejectionModalFormValidationSchema),
  });

  // call when user click on reject button
  const handleRejectedUserList = async (values: IRejectionModalForm) => {
    close();
    await approveUserList(
      adminSelectedData.map((data: any) => ({
        userId: data.userId,
        userStatusId: 3,
        emailId: data.emailId,
        rejectionReason: values.rejectionReason,
      }))
    ).then((res: any) => {
      setSelectedData();
      showNotification({
        title: 'Success',
        message: res.data.message,
        color: 'green',
      });
    });
  };

  return (
    <>
      {/* start: modal */}
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        radius="md"
        size="sm"
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 3,
        }}
      >
        <Flex align="center" justify="center" direction="column" p="24px">
          <Image src={redCrossImage} h={100} w={100}></Image>
          <Text
            ta="center"
            mt="xs"
            mb="lg"
            lh="normal"
            style={{ fontSize: '22px', fontWeight: '600' }}
          >
            Are you sure you want to reject the request?
          </Text>
          <form onSubmit={rejectionForm.onSubmit(handleRejectedUserList)}>
            <Textarea
              rows={3}
              withAsterisk
              label="Reason for rejection"
              placeholder="Enter reason for rejection"
              radius="sm"
              w="100%"
              styles={{
                label: {
                  fontWeight: '600',
                  fontSize: '14px',
                  marginBottom: '8px',
                },
                input: {
                  '&::placeholder': { fontSize: '16px' },
                },
              }}
              {...rejectionForm.getInputProps('rejectionReason')}
              onBlur={(e) => {
                rejectionForm.setFieldValue(
                  'rejectionReason',
                  e.target.value.trim()
                );
                rejectionForm.validateField('rejectionReason');
              }}
            />
            {/* start: button group */}
            <Group mt="lg" gap="md" grow w="100%">
              <Button type="submit" radius="sm" fw={500} lts={2} size="md">
                REJECT
              </Button>
              <Button
                variant="outline"
                radius="sm"
                fw={500}
                lts={2}
                size="md"
                onClick={close}
              >
                CANCEL
              </Button>
            </Group>
          </form>
          {/* end: button group */}
        </Flex>
      </Modal>
      {/* end: modal */}
    </>
  );
};
