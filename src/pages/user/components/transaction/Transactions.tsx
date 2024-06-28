import { Button, Container, Flex, Paper, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import DataTable from '../../../../shared/components/DataTable';
import Pagination from '../../../../shared/components/Pagination';
import { useAppSelector } from '../../../../store/store';
import {
  INCOME_EXPENSE,
  PAGE_SIZE,
} from '../../utility/constants/user.constant';
import { MonthsEnum } from '../../utility/enum/user.enum';
import { useFilterYearMonth } from '../../utility/hooks/useFilterYearMonthHook';
import { ITransactionDetail } from '../../utility/models/user.model';
import {
  useLazyGetTransactionDataQuery,
  useLazyGetTransactionDetailsQuery,
} from '../../utility/services/user.service';
import { SelectYearMonth } from '../SelectYearMonth';
import { expenseTableDataColumns } from '../UserTableDataColumns';

export default function Transactions() {
  const { selectedYear, selectedMonth, handleYearChange, handleMonthChange } =
    useFilterYearMonth();
  const userId = useAppSelector((state) => state.auth.user?.userId);

  const [getTransactionTrigger] = useLazyGetTransactionDataQuery();
  const [getTransactionDetailTrigger] = useLazyGetTransactionDetailsQuery();

  const [dataList, setDataList] = useState<ITransactionDetail[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = PAGE_SIZE;
  const largeScreen = useMediaQuery('(min-width: 1600px)');

  /** get transactions list data */
  useEffect(() => {
    if (userId) {
      getTransactionTrigger({
        userId: userId,
        pageSize,
        pageNumber: currentPage,
        month: Number(MonthsEnum[selectedMonth]),
        year: Number(selectedYear),
      }).then((res: any) => {
        if (res.data) {
          setDataList(res.data.data.transactionsDetail);
          setTotalCount(res.data.data.totalRecordCount);
        }
      });
    }
  }, [dataList, userId, selectedMonth, selectedYear, currentPage]);

  /** download transaction pdf file  */
  async function exportTransaction() {
    let exportUrl: string;
    let name: string;

    await getTransactionDetailTrigger({
      userId: userId,
      year: Number(selectedYear),
      month: Number(MonthsEnum[selectedMonth]),
    }).then((res: any) => {
      if ('data' in res) {
        if (res.data) {
          exportUrl = res.data.data.exportUrl;
          name = res.data.data.fileName;
        }
        if (exportUrl) {
          const url = `data:text/pdf;base64,${exportUrl}`;
          const a = document.createElement('a');
          a.download = `${name}`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        if (res.data.message) {
          showNotification({
            title: 'Success',
            message: res.data.message,
            color: 'green',
          });
        } else {
          showNotification({
            title: 'Error',
            message: res.data?.error,
            color: 'red',
          });
        }
      }
    });
  }

  return (
    <>
      {userId && (
        <Container
          display="flex"
          size="var(--mantine-container-width-user)"
          pb={40}
          px={largeScreen ? 'xs' : '0px'}
          h="100%"
          style={{ overflow: 'hidden', flexDirection: 'column' }}
        >
          <Flex justify="space-between" my={20}>
            <Title order={3}>
              Transactions
              <Text
                component="span"
                c="var(--mantine-color-grey)"
                fz={'20px'}
                fw={'bold'}
                ms={6}
              >
                ({totalCount})
              </Text>
            </Title>
            <Flex gap={10} justify={'flex-end'}>
              <SelectYearMonth
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                handleMonthChange={handleMonthChange}
                handleYearChange={handleYearChange}
                page={INCOME_EXPENSE}
              />
              <Button
                onClick={exportTransaction}
                lts="3px"
                c={!dataList.length ? 'gray.5' : ''}
                bg={!dataList.length ? 'gray.3' : ''}
                disabled={!dataList.length}
              >
                EXPORT
              </Button>
            </Flex>
          </Flex>
          <Paper
            radius="md"
            withBorder
            shadow="md"
            style={{ overflow: 'auto' }}
          >
            {/* Display transaction list using table */}
            <DataTable
              columns={expenseTableDataColumns}
              data={dataList}
              isResponse={true}
            />
            <Flex align="center" justify="center">
              {dataList && dataList.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalCount={totalCount}
                  pageSize={10}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </Flex>
          </Paper>
        </Container>
      )}
    </>
  );
}
