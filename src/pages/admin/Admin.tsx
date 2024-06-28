import { Box, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Notification } from './components/notification/Notification';
import { INotification } from './utility/models/admin.model';
import {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
} from './utility/services/notification.service';

const MemoizedOutlet = React.memo(Outlet);

function Admin() {
  const { data: res } = useGetNotificationsQuery();
  const [notifications, setNotifications] = useState<
    INotification[] | undefined
  >();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<
    number | null | undefined
  >(null);

  const [getNotificationTrigger] = useLazyGetNotificationsQuery();

  async function getNotification() {
    try {
      const res = await getNotificationTrigger().unwrap();
      setNotifications(res.data?.notificationList);
      setUnreadNotificationCount(res.data?.unreadNotificationCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  useEffect(() => {
    getNotification();

    const intervalId = setInterval(() => {
      getNotification();
    }, 1000 * 60);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (res) {
      setNotifications(res.data?.notificationList || []);
      setUnreadNotificationCount(res.data?.unreadNotificationCount || 0);
    }
  }, [res]);

  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Flex direction="column" h="100%">
      <Header
        openNotification={open}
        unreadNotificationCount={unreadNotificationCount}
      />
      <Notification
        notifications={notifications}
        opened={opened}
        close={close}
      />
      <Box h="100%" style={{ overflow: 'auto' }}>
        <MemoizedOutlet />
      </Box>
    </Flex>
  );
}

export default Admin;
