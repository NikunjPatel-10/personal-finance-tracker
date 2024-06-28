import { Drawer, List, Text } from '@mantine/core';
import { INotification } from '../../utility/models/admin.model';
import { NotificationList } from './NotificationList';

interface INotificationProp {
  opened: boolean;
  close: () => void;
  notifications: INotification[] | undefined;
}

export function Notification({
  opened,
  close,
  notifications,
}: INotificationProp) {
  return (
    <Drawer
      trapFocus={false}
      styles={{
        header: {
          borderBottom: '2px solid #eeeff0',
          paddingBlock: '1.5rem',
          paddingInline: '25px',
          color: 'var(--mantine-color-secondary)',
        },
        body: {
          padding: '0px',
        },
      }}
      opened={opened}
      onClose={close}
      position="right"
      title={
        <Text component="span" fw="bold" size="22px">
          Notifications
        </Text>
      }
      overlayProps={{
        blur: 3,
        backgroundOpacity: 0.5,
      }}
      closeButtonProps={{
        icon: (
          <Text
            tabIndex={-1}
            component="span"
            className="icon-close"
            c="var(--mantine-color-grey)"
          ></Text>
        ),
      }}
    >
      <List listStyleType="none">
        {notifications &&
          notifications.map((notification: any) => (
            <NotificationList
              key={notification.notificationId}
              notification={notification}
            />
          ))}
      </List>
    </Drawer>
  );
}
