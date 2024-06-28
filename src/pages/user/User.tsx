import { Box, Checkbox, Flex } from '@mantine/core';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserHeader } from './components/UserHeader';
import UserSidebar from './components/UserSidebar';
import { useGetUser } from './utility/hooks/useGetUser';

function User() {
  const [checked, setChecked] = useState<boolean>(true);
  useGetUser();

  const toggleClick = () => {
    setChecked(!checked);
  };

  return (
    <>
      <Flex h="100%" w="100%" style={{ overflow: 'auto' }}>
        <Checkbox
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          style={{ display: 'none' }}
        />
        <UserSidebar checked={checked} />
        <Flex
          direction="column"
          style={{ flexGrow: 1, overflow: 'hidden' }}
          h="100%"
        >
          <UserHeader handleBurgerClick={toggleClick} />
          <Box style={{ overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default User;
