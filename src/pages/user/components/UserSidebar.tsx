import { Anchor, Box, Flex, Image, List, ListItem } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NavLink, useNavigate } from 'react-router-dom';
import BrandLogoWithoutName from '../../../assets/images/bran-logo-small.svg';
import BrandLogo from '../../../assets/images/brand-logo.svg';
import { SidebarListItem } from '../utility/constants/user.constant';

function UserSidebar({ checked }: { checked: boolean }) {
  const navigate = useNavigate();

  const largeScreenMediaQuery = useMediaQuery('(min-width: 1600px)');

  const largeScreen = largeScreenMediaQuery ? '0 0 300px' : '0 0 280px';
  return (
    <>
      <Box
        bg={'white'}
        h={'100%'}
        flex={checked ? largeScreen : '0 0 80px'}
        maw={checked ? '300px' : '80px'}
        style={{ borderRight: '1px solid var(--mantine-border-color)' }}
        className="transition-all"
      >
        <Flex direction="column" style={{ overflow: 'hidden' }}>
          {/* Brand logo  */}
          {checked ? (
            <Box py={'md'} px={'lg'}>
              <Image w={'160px'} src={BrandLogo} />
            </Box>
          ) : (
            <Box
              h={'45px'}
              w={'45px'}
              my={'md'}
              mx={'md'}
              style={{
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                w={'auto'}
                h="100%"
                style={{ objectFit: 'cover' }}
                src={BrandLogoWithoutName}
              />
            </Box>
          )}
          {/* Navigation for the pages  */}
          <Flex direction={'column'} rowGap={'xl'}>
            <List className="sidebar-nav-list">
              {SidebarListItem.map((listItem, index) => (
                <ListItem
                  px={checked ? 'xl' : '24px'}
                  py={'md'}
                  display={'flex'}
                  key={index}
                  onClick={() => navigate(listItem.redirectTo)}
                  className="sidebar-nav-item cp"
                >
                  <Flex align={'center'} className="transition-all">
                    <span className={`icon ${listItem.icon}`}></span>
                    <Anchor
                      component={NavLink}
                      to={listItem.redirectTo}
                      className={
                        checked ? 'nav-item-text' : 'nav-item-text-remove'
                      }
                      underline="never"
                      px={'sm'}
                    >
                      {listItem.label}
                    </Anchor>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default UserSidebar;
