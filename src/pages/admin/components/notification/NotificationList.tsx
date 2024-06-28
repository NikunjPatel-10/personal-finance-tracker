import { ListItem, Stack, Text, Title } from '@mantine/core';
import { INotification } from '../../utility/models/admin.model';
import { getTimeStamp } from './../../utility/functions/getTimeStamp';

interface INotificationList {
  notification: INotification;
}

export function NotificationList({ notification }: INotificationList) {
  return (
    <ListItem
      py={'15px'}
      px={'25px'}
      bg={notification.isRead ? '' : 'gray.0'}
      style={{ borderBottom: '2px solid #eeeff0' }}
    >
      <Stack gap={'5px'}>
        <Title size="14px" order={5}>
          {notification.notificationContent}
        </Title>
        <Text size="14px" component="p">
          {notification.emailId}
        </Text>
        <Text size="12px" fw="bold" c="var(--mantine-color-grey)" mt="4px">
          {getTimeStamp(notification.createdDate)}
        </Text>
      </Stack>
    </ListItem>
  );
}
