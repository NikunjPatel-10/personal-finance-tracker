import { BarChart, DonutChart, PieChart } from '@mantine/charts';
import {
  Container,
  Flex,
  Grid,
  GridCol,
  Image,
  List,
  ListItem,
  Paper,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import NoBarData from '../../../../assets/images/no-data-bar.jpg';
import NoDonutData from '../../../../assets/images/no-data-donut.jpg';
import NoPieData from '../../../../assets/images/no-data-pie.jpg';
import CustomTooltip from '../../../../shared/components/CustomTooltip';
import ReportCards from '../../../../shared/components/ReportsCard';
import { formatTicks } from '../../../../shared/utility/functions/functions';
import { useAppSelector } from '../../../../store/store';
import {
  CATEGORY_COLORS,
  CHART_SERIES,
  CURRENT_YEAR,
  DASHBOARD_CURRENT_MONTH,
  DASHBOARD_MONTHS,
} from '../../utility/constants/user.constant';
import {
  CategoryTypeEnum,
  ChartEnum,
  MonthsEnum,
} from '../../utility/enum/user.enum';
import {
  ICategoryItem,
  ITotalTransactionDataByMonth,
  ITotalTransactionDataByYear,
} from '../../utility/models/user.model';
import {
  useGetCategoryItemQuery,
  useGetDashboardDetailsByMonthQuery,
  useGetDashboardDetailsByYearQuery,
} from '../../utility/services/user.service';
import { SelectYearMonth } from '../SelectYearMonth';

interface DonutChartProps {
  name: string;
  value: number;
  color: string;
}

export default function Dashboard() {
  const [dataListByMonth, setDataListByMonth] = useState<
    ITotalTransactionDataByMonth[]
  >([]);

  const [dataListByYear, setDataListByYear] = useState<
    ITotalTransactionDataByYear[]
  >([]);

  const [selectedYear, setSelectedYear] = useState<string>(
    CURRENT_YEAR.toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<any>(
    DASHBOARD_MONTHS[DASHBOARD_CURRENT_MONTH]
  );

  const [incomeCategoriesItem, setIncomeCategoriesItem] = useState<
    ICategoryItem[]
  >([]);

  const [expenseCategoriesItem, setExpenseCategoriesItem] = useState<
    ICategoryItem[]
  >([]);

  const userId = useAppSelector((state) => state.auth.user?.userId);

  /** api call for getting dashboard details */
  const { data: res } = useGetDashboardDetailsByMonthQuery({
    userId: userId,
    month: Number(MonthsEnum[selectedMonth]),
    year: Number(selectedYear),
  });

  /** api call for getting dashboard details */
  const { data: response } = useGetDashboardDetailsByYearQuery({
    userId: userId,
    year: Number(selectedYear),
  });

  /** api call for getting income category items */
  const { data: incomeCategoryItem } = useGetCategoryItemQuery(
    CategoryTypeEnum.Income
  );

  /** api call for getting expense category items */
  const { data: expenseCategoryItem } = useGetCategoryItemQuery(
    CategoryTypeEnum.Expense
  );

  /** function to get income category name */
  function getIncomeCategoryName(id: number, categoryTypeId: number) {
    if (categoryTypeId == CategoryTypeEnum.Income) {
      if (incomeCategoriesItem) {
        const name = incomeCategoriesItem.find(
          (category) => category.categoryId == id
        )?.category;
        return name;
      }
    }
  }

  /** function to get expense category name */
  function getExpenseCategoryName(id: number, categoryTypeId: number) {
    if (categoryTypeId == CategoryTypeEnum.Expense) {
      if (expenseCategoriesItem) {
        return expenseCategoriesItem.find(
          (category) => category.categoryId == id
        )?.category;
      }
    }
  }

  /** function get chart data set for all the charts */
  function getTransactionsChartDataset(dataset: any, chart: number) {
    return dataset
      .filter((data: any) =>
        chart == ChartEnum.IncomeCount || chart == ChartEnum.TotalIncome
          ? getIncomeCategoryName(data.categoryId, data.categoryTypeId)
          : getExpenseCategoryName(data.categoryId, data.categoryTypeId)
      )
      .map((data: any) => {
        if (getIncomeCategoryName(data.categoryId, data.categoryTypeId)) {
          if (chart == ChartEnum.IncomeCount) {
            return {
              category: getIncomeCategoryName(
                data.categoryId,
                data.categoryTypeId
              ),
              value: data.totalCount,
            };
          } else if (chart == ChartEnum.TotalIncome) {
            return {
              name: getIncomeCategoryName(data.categoryId, data.categoryTypeId),
              value: data.totalAmount,
              color: CATEGORY_COLORS[data.categoryId],
            };
          }
        } else if (
          getExpenseCategoryName(data.categoryId, data.categoryTypeId)
        ) {
          if (chart == ChartEnum.ExpenseCount) {
            return {
              category: getExpenseCategoryName(
                data.categoryId,
                data.categoryTypeId
              ),
              value: data.totalCount,
            };
          } else if (chart == ChartEnum.TotalExpense) {
            return {
              name: getExpenseCategoryName(
                data.categoryId,
                data.categoryTypeId
              ),
              value: data.totalAmount,
              color: CATEGORY_COLORS[data.categoryId],
            };
          }
        }
      });
  }

  const incomeBarChart = getTransactionsChartDataset(
    dataListByMonth,
    ChartEnum.IncomeCount
  );

  const expenseBarChart = getTransactionsChartDataset(
    dataListByMonth,
    ChartEnum.ExpenseCount
  );

  const incomeDonutChart = getTransactionsChartDataset(
    dataListByMonth,
    ChartEnum.TotalIncome
  );

  const expenseDonutChart = getTransactionsChartDataset(
    dataListByMonth,
    ChartEnum.TotalExpense
  );

  /** set dashboard details, income categories and expense categories */
  useEffect(() => {
    if (res && expenseCategoryItem && incomeCategoryItem && response) {
      setIncomeCategoriesItem(incomeCategoryItem.data.categoriesList);
      setExpenseCategoriesItem(expenseCategoryItem.data.categoriesList);
      setDataListByMonth(res.data.totalTransactionData);
      setDataListByYear(response.data.totalTransactionData);
    }
  }, [res, incomeCategoryItem, expenseCategoryItem, response]);

  // trigger when user select the year
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  // trigger when user select the month
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const largeScreen = useMediaQuery('(min-width: 1600px)');

  return (
    <Container
      display="flex"
      size="var(--mantine-container-width-user)"
      pb={40}
      px={largeScreen ? 'xs' : '0px'}
      h="100%"
      style={{ flexDirection: 'column' }}
    >
      {/* header with title and filter */}
      <Flex justify="space-between" my={20}>
        <Title order={3}>Dashboard</Title>

        <Flex gap={10} justify={'flex-end'}>
          <SelectYearMonth
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            handleMonthChange={handleMonthChange}
            handleYearChange={handleYearChange}
            page="dashboard"
          />
        </Flex>
      </Flex>

      <Grid gutter={largeScreen ? 30 : 20}>
        {res && (
          <>
            {/* cards */}
            <GridCol span={4}>
              <ReportCards
                title="Total Expense"
                count={formatTicks(res.data.totalExpense) || 0}
                icon="icon-card-total-expense"
              />
            </GridCol>

            <GridCol span={4}>
              <ReportCards
                title="Total Income"
                count={formatTicks(res.data.totalIncome) || 0}
                icon="icon-card-total-income"
              />
            </GridCol>

            <GridCol span={4}>
              <ReportCards
                title="Available Balance"
                count={formatTicks(res.data.availableBalance) || 0}
                icon="icon-avaialble-balance"
              />
            </GridCol>
          </>
        )}

        {/* transaction count by expense categories */}
        <GridCol span={largeScreen ? 7.5 : 12} order={1}>
          <Paper
            p={14}
            px={largeScreen ? 30 : 20}
            radius="md"
            shadow="xs"
            h={largeScreen ? 350 : 324}
          >
            <Flex h="100%" direction="column">
              <Title order={4} pt={largeScreen ? 10 : 0} pb={30}>
                Transaction Count By Expense Categories
              </Title>
              {expenseBarChart.length ? (
                <BarChart
                  h={250}
                  data={expenseBarChart}
                  dataKey="category"
                  withBarValueLabel
                  withTooltip={false}
                  xAxisLabel="Category"
                  yAxisLabel="Count of Transaction"
                  strokeDasharray="0.5 0.5"
                  yAxisProps={{
                    tickFormatter: formatTicks,
                    opacity: 0.5,
                  }}
                  styles={{
                    axisLabel: {
                      textAnchor: 'middle',
                    },
                  }}
                  barProps={{
                    radius: [5, 5, 0, 0],
                  }}
                  barChartProps={{ barSize: 25 }}
                  series={[{ name: 'value', color: '#EC7A23' }]}
                />
              ) : (
                <Flex justify="center" h="100%">
                  <Image
                    src={NoBarData}
                    height={largeScreen ? '100%' : '80%'}
                    width="auto"
                  />
                </Flex>
              )}
            </Flex>
          </Paper>
        </GridCol>

        {/* total expense by category */}
        <GridCol span={largeScreen ? 4.5 : 6} order={largeScreen ? 2 : 3}>
          <Paper
            radius="md"
            shadow="xs"
            px={largeScreen ? 30 : 20}
            py={14}
            h={largeScreen ? 350 : 380}
          >
            <Flex h="100%" direction="column">
              <Title
                order={4}
                pt={largeScreen ? 10 : 0}
                pb={expenseDonutChart.length && 20}
              >
                Total Expense By Category
              </Title>
              {expenseDonutChart.length ? (
                <Flex align="center" justify="center">
                  <PieChart
                    strokeWidth={0}
                    size={200}
                    data={expenseDonutChart}
                    withTooltip
                    tooltipProps={{
                      content: (props) => (
                        <CustomTooltip {...props} data={expenseDonutChart} />
                      ),
                    }}
                  />
                  <List style={{ flexGrow: 1 }} ms="xl">
                    {expenseDonutChart.map((data: DonutChartProps) => (
                      <ListItem
                        key={data.name}
                        icon={
                          <ThemeIcon color={data.color} size={10} radius="xl" />
                        }
                        styles={{
                          itemWrapper: { width: '100%' },
                          itemLabel: { width: '100%' },
                        }}
                      >
                        <Grid align="center">
                          <GridCol span={8}>
                            <Text lh={2.1} fz="sm">
                              {data.name}
                            </Text>
                          </GridCol>
                          <GridCol span={4}>
                            <Text
                              lh={2.1}
                              fz="sm"
                              fw="bold"
                              ta="start"
                              style={{ textWrap: 'nowrap' }}
                            >
                              {formatTicks(data.value)}
                            </Text>
                          </GridCol>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </Flex>
              ) : (
                <Flex justify="center" h="100%">
                  <Image src={NoPieData} height="100%" width="auto" />
                </Flex>
              )}
            </Flex>
          </Paper>
        </GridCol>

        {/* transaction count by income categories */}
        <GridCol span={largeScreen ? 7.5 : 12} order={largeScreen ? 3 : 2}>
          <Paper
            p={14}
            px={largeScreen ? 30 : 20}
            pb={10}
            radius="md"
            shadow="xs"
            h={largeScreen ? 350 : 324}
          >
            <Flex h="100%" direction="column">
              <Title order={4} pt={largeScreen ? 10 : 0} pb={30}>
                Transaction Count By Income Categories
              </Title>
              {incomeBarChart.length ? (
                <BarChart
                  h={250}
                  data={incomeBarChart}
                  dataKey="category"
                  withBarValueLabel
                  withTooltip={false}
                  xAxisLabel="Category"
                  yAxisLabel="Count of Transaction"
                  strokeDasharray="0.5 0.5"
                  yAxisProps={{ opacity: 0.5 }}
                  styles={{
                    axisLabel: {
                      textAnchor: 'middle',
                    },
                  }}
                  barProps={{
                    radius: [5, 5, 0, 0],
                  }}
                  barChartProps={{ barSize: 25 }}
                  series={[{ name: 'value', color: '#58A65F' }]}
                />
              ) : (
                <Flex justify="center" h="100%">
                  <Image
                    src={NoBarData}
                    height={largeScreen ? '100%' : '80%'}
                    width="auto"
                  />
                </Flex>
              )}
            </Flex>
          </Paper>
        </GridCol>

        {/* total income by category */}
        <GridCol span={largeScreen ? 4.5 : 6} order={4}>
          <Paper
            radius="md"
            shadow="xs"
            px={largeScreen ? 30 : 20}
            py={14}
            pb={incomeDonutChart.length && 50}
            h={largeScreen ? 350 : 380}
          >
            <Flex h="100%" direction="column">
              <Title
                order={4}
                pt={largeScreen ? 10 : 0}
                pb={
                  largeScreen && incomeDonutChart.length
                    ? 40
                    : incomeDonutChart.length && 60
                }
              >
                Total Income By Category
              </Title>

              {incomeDonutChart.length ? (
                <Flex align="center">
                  <DonutChart
                    strokeWidth={0}
                    thickness={30}
                    size={200}
                    data={incomeDonutChart}
                    withTooltip
                    tooltipProps={{
                      content: (props) => (
                        <CustomTooltip {...props} data={incomeDonutChart} />
                      ),
                    }}
                  />
                  <List style={{ flexGrow: 1 }} ms="xl">
                    {incomeDonutChart.map((data: DonutChartProps) => (
                      <ListItem
                        key={data.name}
                        icon={
                          <ThemeIcon color={data.color} size={10} radius="xl" />
                        }
                        styles={{
                          itemWrapper: { width: '100%' },
                          itemLabel: { width: '100%' },
                        }}
                      >
                        <Grid align="center">
                          <GridCol span={8}>
                            <Text lh={2.1} fz="sm">
                              {data.name}
                            </Text>
                          </GridCol>
                          <GridCol span={4}>
                            <Text
                              lh={2.1}
                              fz="sm"
                              fw="bold"
                              ta="start"
                              style={{ textWrap: 'nowrap' }}
                            >
                              {formatTicks(data.value)}
                            </Text>
                          </GridCol>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </Flex>
              ) : (
                <Flex justify="center" h="100%">
                  <Image src={NoDonutData} height="100%" width="auto" />
                </Flex>
              )}
            </Flex>
          </Paper>
        </GridCol>

        {/* total income, total expense and available balance by month */}
        <GridCol order={5}>
          <Paper
            p={14}
            px={largeScreen ? 30 : 20}
            radius="md"
            shadow="xs"
            h={350}
          >
            <Flex h="100%" direction="column">
              <Title
                order={4}
                pt={largeScreen ? 10 : 0}
                pb={dataListByYear.length && 30}
              >
                Total Income, Total Expense and Available Balance by month
              </Title>

              {dataListByYear.length ? (
                <BarChart
                  h={250}
                  data={dataListByYear}
                  dataKey="month"
                  yAxisLabel="Income, Expense & Available Balance"
                  strokeDasharray="0.5 0.5"
                  valueFormatter={formatTicks}
                  withLegend
                  withTooltip
                  yAxisProps={{
                    tickFormatter: formatTicks,
                    opacity: 0.5,
                    tickMargin: 30,
                    tick: {
                      dx: 30,
                      fontSize: 12,
                    },
                  }}
                  legendProps={{
                    verticalAlign: 'bottom',
                  }}
                  styles={{
                    axisLabel: {
                      textAnchor: 'middle',
                      margin: 30,
                    },

                    legend: {
                      justifyContent: 'center',
                    },
                  }}
                  barChartProps={{ barSize: 25 }}
                  barProps={{
                    radius: [5, 5, 0, 0],
                  }}
                  series={CHART_SERIES}
                />
              ) : (
                <Flex justify="center" h="90%">
                  <Image src={NoBarData} height="100%" width="auto" />
                </Flex>
              )}
            </Flex>
          </Paper>
        </GridCol>
      </Grid>
    </Container>
  );
}
