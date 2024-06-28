import {
  Avatar,
  Box,
  Burger,
  Container,
  Divider,
  Flex,
  Popover,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { signOut } from '../../../core/utility/services/auth-service';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import { useAppSelector } from '../../../store/store';
import { IUserData } from '../utility/models/user.model';
import { ChangePasswordForm } from './ChangePasswordForm';
import UserProfile from './UserProfile';

interface IProps {
  handleBurgerClick: () => void;
}

export const UserHeader = ({ handleBurgerClick }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const userData = useAppSelector((state) => state.auth.user);
  const [user, setUser] = useState<IUserData>();
  const [initials, setInitials] = useState<string>('');
  const [showProfile, setShowProfile] = useState(false);
  const [profileOpened, { open: openProfile, close: closeProfile }] =
    useDisclosure(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [
    changedPasswordOpened,
    { open: openChangePassword, close: closeChangePassword },
  ] = useDisclosure(false);

  const largeScreen = useMediaQuery('(min-width: 1600px)');

  const onProfileClick = () => {
    setShowProfile(true);
    openProfile();
  };

  const onCloseProfile = () => {
    setShowProfile(false);
    closeProfile();
  };

  const onChangePasswordClick = () => {
    setShowChangePassword(true);
    openChangePassword();
  };

  const onCloseChangePassword = () => {
    setShowChangePassword(false);
    closeChangePassword();
  };

  useEffect(() => {
    if (userData) {
      setUser(userData);
      const initials = userData.lastName
        ? `${userData.firstName.charAt(0).toUpperCase()}${userData.lastName
            .charAt(0)
            .toUpperCase()}`
        : userData.firstName.charAt(0).toUpperCase();
      setInitials(initials);
    }
  }, [userData]);

  return (
    <Box
      component="header"
      style={{ borderBottom: '1px solid var(--mantine-border-color)' }}
    >
      <Container
        size={'var(--mantine-container-width-user)'}
        h={'var(--mantine-header-height)'}
        display="flex"
        px={largeScreen ? 'xs' : '0px'}
        style={{ justifyContent: 'space-between' }}
      >
        <Flex h={'100%'} align={'center'}>
          <Burger
            size="md"
            aria-label="Toggle navigation"
            color="#8694AA"
            onClick={handleBurgerClick}
          />
        </Flex>
        <Flex h={'100%'} align={'center'}>
          {/* Right section of the header  */}
          <Box display={'flex'} h={'100%'}>
            <Divider
              size={2}
              mx="xl"
              my={'xs'}
              orientation="vertical"
            ></Divider>
            <Popover
              width={200}
              position="bottom-end"
              withArrow
              arrowPosition="side"
              shadow="md"
              arrowOffset={10}
              arrowSize={10}
              offset={-10}
              zIndex={100}
            >
              {user && (
                <Popover.Target>
                  {/* Manage user profile  */}
                  <Flex align={'center'} gap="sm" className="cp">
                    <Avatar src={user.image} size="md">
                      {initials}
                    </Avatar>
                    <Text
                      tt="capitalize"
                      c="var(--mantine-color-secondary)"
                      fw="600"
                    >
                      {user.firstName} {user?.lastName}
                    </Text>
                    <Text
                      component="span"
                      size="xs"
                      className="icon-arrow-down"
                    ></Text>
                  </Flex>
                </Popover.Target>
              )}
              <Popover.Dropdown p={'sm'}>
                <UnstyledButton
                  py={'xs'}
                  w="100%"
                  className="cp"
                  display="flex"
                  style={{
                    alignItems: 'center',
                    columnGap: '7px',
                  }}
                  onClick={onProfileClick}
                >
                  <Text
                    bg="none"
                    display={'inline-block'}
                    c="var(--mantine-color-grey)"
                    className="icon-user cp"
                    size="xl"
                  ></Text>
                  <Text style={{ textWrap: 'nowrap' }}>My Profile</Text>
                </UnstyledButton>

                <UnstyledButton
                  py={'xs'}
                  w="100%"
                  className="cp"
                  display="flex"
                  style={{
                    alignItems: 'center',
                    columnGap: '7px',
                  }}
                  onClick={onChangePasswordClick}
                >
                  <Text
                    bg="none"
                    display={'inline-block'}
                    c="var(--mantine-color-grey)"
                    className="icon-change-password cp"
                    size="xl"
                    fw="bold"
                  ></Text>
                  <Text style={{ textWrap: 'nowrap' }}>Change Password</Text>
                </UnstyledButton>

                <UnstyledButton
                  py={'xs'}
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
                    size="xl"
                  ></Text>
                  <Text style={{ textWrap: 'nowrap' }}>Sign Out</Text>
                </UnstyledButton>
              </Popover.Dropdown>
            </Popover>
            {showProfile && (
              <UserProfile close={onCloseProfile} opened={profileOpened} />
            )}
            {showChangePassword && (
              <ChangePasswordForm
                close={onCloseChangePassword}
                opened={changedPasswordOpened}
              />
            )}
          </Box>
        </Flex>
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
      </Container>
    </Box>
  );
};
