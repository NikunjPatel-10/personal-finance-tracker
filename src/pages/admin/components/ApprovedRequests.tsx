import {
  Button,
  Container,
  Flex,
  Modal,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../../shared/components/ConfirmationModal';
import DataTable from '../../../shared/components/DataTable';
import Pagination from '../../../shared/components/Pagination';
import { IUserData } from '../utility/models/admin.model';
import {
  useGetUserListDataQuery,
  useLazyGetUserListDataQuery,
  useUpdateApproveUserListMutation,
} from '../utility/services/admin.service';
import iconActive from './../../../assets/images/icon-active.svg';
import iconInactive from './../../../assets/images/icon-inactive.svg';
import { approvedRequestTableDataColumns } from './TableDataColumns';

import { showNotification } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { setApprovedUserSearchQuery } from '../../../features/search/search';
import { PAGE_SIZE } from '../../user/utility/constants/user.constant';
import { ActivateDeactivateModalText } from '../utility/constants/activateDeactivateModal.constant';
import CreateUserForm from './CreateUserForm';
import Search from './Search';
import UserDetails from './UserDetails';

function ApprovedRequests() {
  const [approvedUserList, setApprovedUserList] = useState<IUserData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [isResponse, setIsResponse] = useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<IUserData>();
  const [userId, setUserId] = useState<number>(1);
  const approvedSearchState = useSelector(
    (state: any) => state.search.approveUserSearchQuery
  );
  const pageSize = PAGE_SIZE;
  const [updateUserStatus] = useUpdateApproveUserListMutation();
  const [
    confirmationModalopened,
    { open: openConfirmationModal, close: closeConfirmationModal },
  ] = useDisclosure(false);
  const [
    createUserFormOpened,
    { open: openCreateUserFormModal, close: closeCreateUserFormModal },
  ] = useDisclosure(false);

  const [
    userDetailOpened,
    { open: openUserDetailModal, close: closeUserDetailModal },
  ] = useDisclosure(false);

  const [debounced] = useDebouncedValue(approvedSearchState, 500);
  // get the approved userList
  const { data: res } = useGetUserListDataQuery({
    statusId: 2,
    pageNumber: currentPage,
    pageSize,
    SearchParam: debounced,
  });
  const [userListData] = useLazyGetUserListDataQuery();

  useEffect(() => {
    if (res) {
      setApprovedUserList(res.data.usersList);
      setTotalCount(res.data.totalRecordCount);
      setIsResponse(true);
    }

    if (approvedSearchState.length >= 1) {
      setCurrentPage(1);
    }
  }, [res, approvedSearchState]);

 // getting approved user-list without page-refresh  
  useEffect(()=>{
    userListData({
      statusId: 2,
      pageNumber: currentPage,
      pageSize,
      SearchParam: debounced,
    });
  },[])

  const handleUserAccountStatus = (user: any) => {
    setUserStatus(user);
    openConfirmationModal();
  };

  //  for managing userAccountStatus
  const userAccountStatusHandler = async () => {
    if (userStatus) {
      await updateUserStatus({
        userId: userStatus.userId,
        isActive: !userStatus.isActive,
      }).then((response: any) => {
        if (response.data) {
          if (response.data.message) {
            showNotification({
              title: 'Success',
              message: response.data.message,
              color: 'green',
            });
          } else {
            showNotification({
              title: 'Error',
              message: response.data.error,
              color: 'red',
            });
          }
        }
      });
    }
    closeConfirmationModal();
  };

  const userDetailHandler = (userId: number) => {
    setUserId(userId);
  };

  // for closing confirmationModal without changing account-status
  const cancelAccountStatusHandler = () => {
    closeConfirmationModal();
  };

  return (
    <Container
      display="flex"
      size="var(--mantine-container-width-admin)"
      pb={40}
      h="100%"
      style={{ overflow: 'hidden', flexDirection: 'column' }}
    >
      <Flex justify="space-between">
        <Title order={2} my={20}>
          Approved Requests
        </Title>
        <Flex align="center">
          <Search
            searchTerm={approvedSearchState}
            setSearchQuery={setApprovedUserSearchQuery}
          />
          <Button mx="10px" lts="3px" onClick={openCreateUserFormModal}>
            CREATE NEW USER
          </Button>
        </Flex>
      </Flex>
      <Paper radius="md" withBorder shadow="md" style={{ overflow: 'auto' }}>
        {/* Display approved requests using table */}
        <DataTable
          columns={approvedRequestTableDataColumns}
          data={approvedUserList}
          page="approval"
          isResponse={isResponse}
          openUserDetailModal={openUserDetailModal}
          onUserStatus={handleUserAccountStatus}
          onUserDetail={userDetailHandler}
        />

        <Flex align="center" justify="center">
          {approvedUserList && approvedUserList.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Flex>
      </Paper>

      {/* Conformation Modal for managing account-status  */}
      {userStatus && (
        <ConfirmationModal
          handlePositiveButton={userAccountStatusHandler}
          handleNegativeButton={cancelAccountStatusHandler}
          opened={confirmationModalopened}
          confirmationMessage={`${
            ActivateDeactivateModalText.CONFIRMATION_MESSAGE
          } ${
            userStatus && userStatus.isActive
              ? ActivateDeactivateModalText.DEACTIVATE
              : ActivateDeactivateModalText.ACTIVATE
          } ${ActivateDeactivateModalText.THE_USER_TEXT}`}
          imageSource={`${
            userStatus && userStatus.isActive ? iconInactive : iconActive
          }`}
          positiveButtonText={
            userStatus && userStatus.isActive
              ? ActivateDeactivateModalText.DEACTIVATE
              : ActivateDeactivateModalText.ACTIVATE
          }
          negativeButtonText={ActivateDeactivateModalText.CANCEL}
        />
      )}

      {/* createUserForm Modal  */}
      <Modal
        opened={createUserFormOpened}
        onClose={closeCreateUserFormModal}
        withCloseButton={false}
        radius={10}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 3,
        }}
        centered
        trapFocus={false}
      >
        <CreateUserForm close={closeCreateUserFormModal} />
      </Modal>

      {/* userDetail Modal  */}
      <Modal
        opened={userDetailOpened}
        onClose={closeUserDetailModal}
        size="xl"
        radius={10}
        centered
        trapFocus={false}
        styles={{
          header: {
            padding: '10px 20px 0px',
            minHeight: '0px',
          },
          body: {
            padding: '0px 30px 30px',
          },
        }}
        closeButtonProps={{
          icon: (
            <Text
              component="span"
              className="icon-close"
              c="var(--mantine-color-grey)"
              // m={'10px'}
            ></Text>
          ),
        }}
      >
        <UserDetails userId={userId} />
      </Modal>
    </Container>
  );
}
export default ApprovedRequests;
