import { Container, Flex, Paper, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setRejectedUserSearchQuery } from '../../../features/search/search';
import DataTable from '../../../shared/components/DataTable';
import Pagination from '../../../shared/components/Pagination';
import { PAGE_SIZE } from '../../user/utility/constants/user.constant';
import { IUserData } from '../utility/models/admin.model';
import { useGetUserListDataQuery, useLazyGetUserListDataQuery } from '../utility/services/admin.service';
import Search from './Search';
import { rejectedRequestTableDataColumns } from './TableDataColumns';

function RejectedRequests() {
  const [rejectedUserList, setRejectedUserList] = useState<IUserData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [isResponse, setIsResponse] = useState<boolean>(false);
  const rejectedSearchState = useSelector(
    (state: any) => state.search.rejectedUserSearchQuery
  );
  const pageSize = PAGE_SIZE;

  const [debounced] = useDebouncedValue(rejectedSearchState, 500);
  // get the rejected userList
  const { data: res } = useGetUserListDataQuery({
    statusId: 3,
    pageNumber: currentPage,
    pageSize,
    SearchParam: debounced,
  });
  const [userListData] = useLazyGetUserListDataQuery();

  useEffect(() => {
    if (res) {
      setRejectedUserList(res.data.usersList);
      setTotalCount(res.data.totalRecordCount);
      setIsResponse(true);
    }
    if (rejectedSearchState.length >= 1) {
      setCurrentPage(1);
    }
  }, [res, rejectedSearchState]);

 // getting rejected user-list without page-refresh 
  useEffect(()=>{
    userListData({
      statusId: 3,
      pageNumber: currentPage,
      pageSize,
      SearchParam: debounced,
    });
  },[])

  return (
    <Container
      display="flex"
      size="var(--mantine-container-width-admin)"
      pb={40}
      h="100%"
      style={{ overflow: 'hidden', flexDirection: 'column' }}
    >
      <Flex justify="space-between" align="center">
        <Title order={2} my={20}>
          Rejected Requests
        </Title>
        <Search
          searchTerm={rejectedSearchState}
          setSearchQuery={setRejectedUserSearchQuery}
        />
      </Flex>
      <Paper radius="md" withBorder shadow="md" style={{ overflow: 'auto' }}>
        {/* Display rejected requests using table */}
        <DataTable
          columns={rejectedRequestTableDataColumns}
          data={rejectedUserList}
          page="rejected"
          isResponse={isResponse}
        />
        <Flex align="center" justify="center">
          {rejectedUserList && rejectedUserList.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Flex>
      </Paper>
    </Container>
  );
}

export default RejectedRequests;
