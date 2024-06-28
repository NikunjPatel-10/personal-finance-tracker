import {
  Box,
  Checkbox,
  Flex,
  Switch,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { format } from 'date-fns';
import { IUserData } from '../../pages/admin/utility/models/admin.model';
import { CategoryType } from '../../pages/user/utility/constants/user.constant';
import { categoryMap } from '../../pages/user/utility/functions/functions';
import { ITransactionDetail } from '../../pages/user/utility/models/user.model';
import { IColumn } from '../utility/models/shared.model';

type Data = IUserData[] | ITransactionDetail[];
interface IProps {
  data: Data;
  columns: IColumn[];
  page?: string;
  currentPage?: number;
  selectedData?: any;
  onSelectRow?: (row: any) => void;
  onSelectRows?: () => void;
  isResponse: boolean;
  onUserStatus?: (row: any) => void;
  openUserDetailModal?: () => void;
  onUserDetail?: (userId: any) => void;
  onEditTransaction?: (transactionId: any) => void;
  onDeleteTransaction?: (transactionId: any) => void;
}

const DataTable = ({
  data,
  columns,
  page,
  currentPage,
  selectedData,
  onSelectRow,
  onSelectRows,
  isResponse,
  openUserDetailModal,
  onUserStatus,
  onUserDetail,
  onEditTransaction,
  onDeleteTransaction,
}: IProps) => {
  const handleRowClick = (userId: number) => {
    if (page === 'approval') {
      openUserDetailModal?.();
      onUserDetail?.(userId);
    }
  };

  function handleEditClick(transaction: ITransactionDetail) {
    onEditTransaction?.(transaction);
  }
  function handleDeleteClick(transactionId: string) {
    onDeleteTransaction?.(transactionId);
  }

  return (
    // Start: Table
    <Table verticalSpacing="sm" horizontalSpacing="lg" miw={300} stickyHeader>
      {/* Start: Table header */}
      <Table.Thead bg="white">
        <Table.Tr>
          {/* Display checkbox on pending requests page */}
          {page === 'pending' && currentPage && (
            <Table.Th style={{ borderBottom: '3px solid #eeeff0' }} w={60}>
              <Checkbox
                name="select-all"
                aria-label="Select all rows on this page"
                checked={selectedData[currentPage]?.length === data?.length}
                onChange={onSelectRows}
              />
            </Table.Th>
          )}

          {columns &&
            columns.map((column) => (
              <Table.Th
                key={column.key}
                py={20}
                fw={700}
                style={{
                  borderBottom: '3px solid #eeeff0',
                  textWrap: 'nowrap',
                }}
                tt="uppercase"
              >
                {column.label}
              </Table.Th>
            ))}
          {/* Display switch on approved requests page */}
          {page == 'approval' && (
            <Table.Th tt="uppercase" ta="center">
              Account Status
            </Table.Th>
          )}
          {(page == 'Income' || page == 'Expense') && (
            <Table.Th tt="uppercase" ta="center">
              Action
            </Table.Th>
          )}
        </Table.Tr>
      </Table.Thead>
      {/* End: Table header */}
      {/* Start: Table body */}
      <Table.Tbody>
        {isResponse
          ? data?.length > 0 &&
            data?.map((row: any) => (
              <Table.Tr
                key={row.emailId || row.userId || row.transactionId}
                onClick={() => handleRowClick(row.userId)}
                style={{ cursor: page === 'approval' ? 'pointer' : 'default' }}
              >
                {page === 'pending' && currentPage && (
                  <>
                    <Table.Td c="var(--mantine-color-secondary)" py={18}>
                      <Checkbox
                        name={`table-${row.emailId}`}
                        aria-label="Select row"
                        checked={
                          selectedData[currentPage]?.find(
                            (selectedUser: any) =>
                              selectedUser.emailId === row.emailId
                          )
                            ? true
                            : false
                        }
                        onClick={() => onSelectRow?.(row)}
                        onChange={() => null}
                      />
                    </Table.Td>
                  </>
                )}
                {columns &&
                  columns?.map((column) => (
                    <Table.Td
                      key={column.key}
                      c="var(--mantine-color-secondary)"
                      py={18}
                    >
                      <Text component="p" size="md">
                        {renderCell(row, column, page)}
                      </Text>
                    </Table.Td>
                  ))}
                {page == 'approval' && (
                  <Table.Td c="var(--mantine-color-secondary)" py={18}>
                    <Flex justify="center">
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Switch
                          color="green"
                          checked={row.isActive}
                          onChange={() => onUserStatus?.(row)}
                        />
                      </Box>
                    </Flex>
                  </Table.Td>
                )}
                {(page == 'Income' || page == 'Expense') &&
                  row?.transactionId && (
                    <Table.Td
                      c="var(--mantine-color-secondary)"
                      py={18}
                      ta={'center'}
                    >
                      <Flex
                        component="span"
                        align="center"
                        justify="center"
                        gap="12"
                      >
                        <Text
                          bg="none"
                          size="18px"
                          className="icon-edit cp"
                          c="var(--mantine-color-grey)"
                          onClick={() => handleEditClick(row)}
                        ></Text>
                        <Text
                          size="18px"
                          className="icon-delete cp"
                          c="var(--mantine-color-grey)"
                          onClick={() => handleDeleteClick(row.transactionId)}
                        ></Text>
                      </Flex>
                    </Table.Td>
                  )}
              </Table.Tr>
            ))
          : ''}
        {isResponse && !data?.length && (
          <Table.Tr>
            <Table.Td colSpan={columns?.length + 1} ta="center" fz="md">
              No Data Found
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
      {/* End: Table body */}
    </Table>
    // End: Table
  );
};

/**
 *
 * @param row - data object
 * @param column - column labels
 * @returns cell data to be displayed
 */
function renderCell(row: any, column: IColumn, page?: string) {
  const value = row[column.key as keyof IUserData];

  if (!value || value === null || '') {
    return <Text component="span">-</Text>;
  }

  if (column.key === 'statusTimestamp' && value) {
    return format(value, 'MM/dd/yyyy hh:mm:ss a');
  }

  if (column.key === 'rejectionReason' && value) {
    const tooltipPosition = value.length <= 10 ? 'bottom-start' : 'bottom-end';
    return (
      <Tooltip
        label={value}
        position={tooltipPosition}
        withArrow
        arrowPosition="center"
        arrowSize={15}
        styles={(theme) => ({
          tooltip: {
            backgroundColor: 'white',
            color: 'black',
            border: `1px solid ${theme.colors.gray[3]}`,
            boxShadow: theme.shadows.md,
            maxWidth: '400px',
            whiteSpace: 'wrap',
          },
          arrow: {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: `${theme.colors.gray[3]} `,
          },
        })}
      >
        <Text
          component="span"
          style={{
            display: 'block',
            whiteSpace: 'nowrap',
            width: '110px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          }}
        >
          {value}
        </Text>
      </Tooltip>
    );
  }

  if (column.key === 'amount' && value) {
    if (row.categoryTypeId == 1 || page == CategoryType.INCOME) {
      return (
        <Text component="span" c={'green'} fw={'bold'}>{`\₹ ${value}`}</Text>
      );
    } else {
      return (
        <Text component="span" c={'red'} fw={'bold'}>{`-\₹ ${value}`}</Text>
      );
    }
  }

  if (column.key === 'category' && value) {
    const iconValue = categoryMap.get(value);

    return (
      iconValue && (
        <Flex component="span" align={'center'}>
          <Text
            component="span"
            className={iconValue}
            style={{ borderRadius: '5px' }}
            c="var(--mantine-color-grey)"
            bg="#e7eaef"
            p={5}
            fz={24}
            me={10}
          />
          <Text component="span">{value}</Text>
        </Flex>
      )
    );
  }

  if (column.key === 'transactionDate' && value) {
    return format(value, 'MM-dd-yyyy');
  }
  return value;
}

export default DataTable;
