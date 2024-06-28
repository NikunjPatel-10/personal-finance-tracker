import {
  Anchor,
  Avatar,
  Box,
  Container,
  Divider,
  Flex,
  Image,
  Indicator,
  Popover,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { memo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../../../assets/images/brand-logo.svg';
import ProfileImage from '../../../assets/images/profile-thumb.svg';
import { PftRoutes } from '../../../core/utility/enums/core.enum';
import { signOut } from '../../../core/utility/services/auth-service';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { useUpdateNotificationsMutation } from '../utility/services/notification.service';

interface IHeader {
  openNotification: () => void;
  unreadNotificationCount: number | null | undefined;
}

export const Header = memo(
  ({ openNotification, unreadNotificationCount }: IHeader) => {
    // For Sign-out confirmation modal
    const [isOpen, setIsOpen] = useState(false);
    const [isPopover, setIsPopover] = useState(false);

    const [updateNotificationTrigger] = useUpdateNotificationsMutation();

    const user = localStorage.getItem('profile');
    const userName = user && JSON.parse(user).fullname;

    async function handleOpenNotification() {
      openNotification();
      await updateNotificationTrigger();
    }

    return (
      <Box component="header" bg={'white'}>
        <Container
          size={'var(--mantine-container-width-admin)'}
          h={'var(--mantine-header-height)'}
        >
          <Flex justify="space-between" h={'100%'} align={'center'}>
            {/* Left section of the header  */}
            <Flex>
              {/* Brand logo  */}
              <Box py={'xs'}>
                <Image w={'160px'} src={BrandLogo} />
              </Box>

              <Divider mx="lg" my="lg" size="2" orientation="vertical" />
              {/* Navigation for the pages  */}
              <Flex columnGap={'xl'}>
                <Anchor
                  component={NavLink}
                  to={PftRoutes.PENDING_REQUESTS}
                  className="navlink"
                  underline="never"
                >
                  Pending Requests
                </Anchor>
                <Anchor
                  className="navlink"
                  component={NavLink}
                  to={PftRoutes.APPROVED_REQUESTS}
                  underline="never"
                >
                  Approved Requests
                </Anchor>
                <Anchor
                  className="navlink"
                  component={NavLink}
                  to={PftRoutes.REJECTED_REQUESTS}
                  underline="never"
                >
                  Rejected Requests
                </Anchor>
                <Anchor
                  className="navlink"
                  component={NavLink}
                  to={PftRoutes.USER_REPORTS}
                  underline="never"
                >
                  User Reports
                </Anchor>
              </Flex>
            </Flex>
            {/* Right section of the header  */}
            <Box display={'flex'} h={'100%'}>
              {/* Notification icon */}
              <Flex align={'center'} c={'var(--mantine-color-secondary)'}>
                <Indicator
                  offset={3}
                  size={'16px'}
                  zIndex={10}
                  withBorder={unreadNotificationCount ? true : false}
                  label={
                    !unreadNotificationCount ? (
                      ''
                    ) : (
                      <Text size="8px" fw="bold">
                        {unreadNotificationCount && unreadNotificationCount >= 5
                          ? '5+'
                          : unreadNotificationCount}
                      </Text>
                    )
                  }
                  onClick={handleOpenNotification}
                  color={!unreadNotificationCount ? 'transparent' : 'primary'}
                  radius="100%"
                  className="cp"
                >
                  <Text
                    component="span"
                    size={'xl'}
                    className="icon-notification"
                    opacity={0.7}
                  ></Text>
                </Indicator>
              </Flex>
              <Divider
                size={2}
                mx={'lg'}
                my={'xs'}
                orientation="vertical"
              ></Divider>
              {/* Manage user profile  */}
              {/* Profile popover action icon and dropdown */}
              <Popover
                onChange={() => setIsPopover((show) => !show)}
                width="target"
                position="bottom-end"
                withArrow
                arrowOffset={15}
                offset={-8}
                shadow="sm"
              >
                <Popover.Target>
                  <Flex
                    align="center"
                    columnGap="10px"
                    className="cp"
                    pe={'12px'}
                  >
                    <Avatar
                      size={'45px'}
                      src={ProfileImage}
                      alt="Profile Image"
                      radius="xl"
                    />
                    <Text c="var(--mantine-color-secondary)" fw="600">
                      {userName}
                    </Text>
                    <Text
                      component="span"
                      size="xs"
                      c="primary"
                      className={
                        isPopover ? 'icon-arrow-up' : 'icon-arrow-down'
                      }
                    />
                  </Flex>
                </Popover.Target>
                <Popover.Dropdown style={{ padding: '0px' }}>
                  <UnstyledButton
                    p={'sm'}
                    w="100%"
                    className="cp"
                    display="flex"
                    style={{
                      alignItems: 'center',
                      columnGap: '7px',
                    }}
                    onClick={() => setIsOpen(true)}
                  >
                    <Text
                      bg="none"
                      display={'inline-block'}
                      c="var(--mantine-color-grey)"
                      className="icon-sign-out"
                    ></Text>
                    <Text>Sign out</Text>
                  </UnstyledButton>
                </Popover.Dropdown>
              </Popover>
              {/* Sign out model */}
              <ConfirmationModal
                opened={isOpen}
                positiveButtonText="Yes"
                negativeButtonText="No"
                confirmationMessage="Are you sure you want to Sign out?"
                handleNegativeButton={() => setIsOpen(false)}
                handlePositiveButton={() => {
                  signOut();
                }}
              />
            </Box>
          </Flex>
        </Container>
      </Box>
    );
  }
);
