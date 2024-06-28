import { Button, Container, Flex, Paper, Text, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../../../shared/components/ConfirmationModal';
import DataTable from '../../../../shared/components/DataTable';
import Pagination from '../../../../shared/components/Pagination';
import {
  CategoryType,
  DeleteTransactionModel,
  INCOME_EXPENSE,
  PAGE_SIZE,
} from '../../utility/constants/user.constant';
import { CategoryTypeEnum, MonthsEnum } from '../../utility/enum/user.enum';
import { useFilterYearMonth } from '../../utility/hooks/useFilterYearMonthHook';
import { ITransactionDetail } from '../../utility/models/user.model';
import {
  useDeleteIncomeExpenseDataMutation,
  useGetIncomeExpenseDataQuery,
} from '../../utility/services/user.service';
import { SelectYearMonth } from '../SelectYearMonth';
import { expenseTableDataColumns } from '../UserTableDataColumns';
import deleteImageUrl from './../../../../assets/images/delete-img.svg';
interface IProps {
  openAddIncomeModal: () => void;
  openEditIncomeModal: (transaction: ITransactionDetail) => void;
  userId: number;
}

export default function IncomeList({
  openAddIncomeModal: openAddExpenseModal,
  openEditIncomeModal,
  userId,
}: IProps) {
  const [deleteIncomeTransaction] = useDeleteIncomeExpenseDataMutation();

  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const { selectedYear, selectedMonth, handleYearChange, handleMonthChange } =
    useFilterYearMonth();

  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);

  const [dataList, setDataList] = useState<ITransactionDetail[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const pageSize = PAGE_SIZE;

  const largeScreen = useMediaQuery('(min-width: 1600px)');

  const { data: res } = useGetIncomeExpenseDataQuery({
    userId: userId,
    categoryTypeId: CategoryTypeEnum.Income,
    pageSize,
    pageNumber: currentPage,
    month: Number(MonthsEnum[selectedMonth]),
    year: Number(selectedYear),
  });

  /** get income list data */
  useEffect(() => {
    if (res) {
      setDataList(res.data.incomeExpenseDetails);
      setTotalCount(res.data.totalRecordCount);
    }
  }, [res]);

  function handleOpenDeleteTransactionModel(id: any) {
    setSelectedTransactionId(id);
    openDeleteModal();
  }

  function handleDeletetransaction() {
    // Handle Deleting Transactions
    deleteIncomeTransaction({
      userId,
      transactionId: Number(selectedTransactionId),
    }).then((response: any) => {
      if ('data' in response) {
        if (response.data.message) {
          showNotification({
            title: 'Success',
            message: response.data.message,
            color: 'green',
          });
          closeDeleteModal();
        } else {
          showNotification({
            title: 'Error',
            message: response.data?.error,
            color: 'red',
          });
        }
      }
    });
  }

  return (
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
          Income
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
          <Button tt="uppercase" onClick={openAddExpenseModal}>
            add Income
          </Button>
        </Flex>
      </Flex>
      <Paper radius="md" withBorder shadow="md" style={{ overflow: 'auto' }}>
        {/* Display Income list using table */}
        <DataTable
          columns={expenseTableDataColumns}
          data={dataList}
          page={CategoryType.INCOME}
          isResponse={true}
          onEditTransaction={(transaction) => openEditIncomeModal(transaction)}
          onDeleteTransaction={handleOpenDeleteTransactionModel}
        />
        <Flex align="center" justify="center">
          {dataList && dataList.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Flex>
        <ConfirmationModal
          opened={deleteModalOpened}
          confirmationMessage={DeleteTransactionModel.CONFIRM_MESSAGES.DELETE}
          handleNegativeButton={closeDeleteModal}
          handlePositiveButton={handleDeletetransaction}
          negativeButtonText={DeleteTransactionModel.BUTTON_TEXT.NO}
          positiveButtonText={DeleteTransactionModel.BUTTON_TEXT.YES}
          imageSource={deleteImageUrl}
        ></ConfirmationModal>
      </Paper>
    </Container>
  );
}
