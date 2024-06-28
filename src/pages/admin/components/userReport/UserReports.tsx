import { BarChart, DonutChart, PieChart } from '@mantine/charts';
import {
  Anchor,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  List,
  ListItem,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import NoBarData from '../../../../assets/images/no-data-bar.jpg';
import NoDonutData from '../../../../assets/images/no-data-donut.jpg';
import NoPieData from '../../../../assets/images/no-data-pie.jpg';
import { PftRoutes } from '../../../../core/utility/enums/core.enum';
import CustomTooltip from '../../../../shared/components/CustomTooltip';
import ReportCards from '../../../../shared/components/ReportsCard';
import { SelectYearMonth } from '../../../user/components/SelectYearMonth';
import {
  CURRENT_YEAR,
  DASHBOARD_CURRENT_MONTH,
  DASHBOARD_MONTHS,
} from '../../../user/utility/constants/user.constant';
import { MonthsEnum } from '../../../user/utility/enum/user.enum';
import {
  ActiveInactiveUserCountColor,
  ActiveInactiveUserCountName,
  UserCountColor,
  UserCountName,
} from '../../utility/constants/admin.constant';
import { ChartEnum } from '../../utility/enum/admin.enum';
import {
  IUserStatusCount,
  IUserStatusCountByMonth,
} from '../../utility/models/admin.model';
import {
  useGetUserStatusCountByMonthQuery,
  useGetUserStatusCountQuery,
} from '../../utility/services/admin.service';

const UserReports = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    CURRENT_YEAR.toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<any>(
    DASHBOARD_MONTHS[DASHBOARD_CURRENT_MONTH]
  );
  const [userStatusCount, setUserStatusCount] = useState<IUserStatusCount>();
  const [userStatusCountByMonth, setUserStatusCountByMonth] =
    useState<IUserStatusCountByMonth>();

  const { data: userStatusCountData } = useGetUserStatusCountQuery();

  const { data: userStatusCountByMonthData } =
    useGetUserStatusCountByMonthQuery({
      month: Number(MonthsEnum[selectedMonth]),
      year: Number(selectedYear),
    });

  /**
   *
   * @param month selected month for filtering data
   * @param chart for which chart, data transformed is needed
   * @returns array of objects containing chart data
   */
  const getUserStatusCountsDataset = (month: string, chart: number) => {
    const dataSetArray = [];
    userStatusCountByMonth && dataSetArray.push(userStatusCountByMonth);

    // map data for donut chart to display user count
    if (chart == ChartEnum.UserCount) {
      const chartData =
        userStatusCountByMonth &&
        Object.keys(userStatusCountByMonth)
          .filter((key) => key !== 'registeredUsers')
          .map((key) => ({
            name: UserCountName[`${key.toUpperCase()}`],
            value: userStatusCountByMonth[key as keyof IUserStatusCountByMonth],
            color: UserCountColor[key.toUpperCase()],
          }));
      return chartData;
    }

    // map data for bar chart to display approved user count
    else if (chart == ChartEnum.ApprovedUsers)
      return dataSetArray.map((item) => {
        return {
          name: month,
          value: item.approvedUsers,
          color: UserCountColor.APPROVEDUSERS,
        };
      });
    // map data for bar chart to display rejected user count
    else if (chart == ChartEnum.RejectedUsers)
      return dataSetArray.map((item) => {
        return {
          name: month,
          value: item.rejectedUsers,
          color: UserCountColor.REJECTEDUSERS,
        };
      });
    // map data for bar chart to display registered user count
    else if (chart == ChartEnum.RegisteredUser)
      return dataSetArray.map((item) => {
        return {
          name: month,
          value: item.registeredUsers,
          color: UserCountColor.PENDINGUSERS,
        };
      });
  };

  // get active and inactive user count for displaying in pie chart
  const getActiveInactiveDataset = () => {
    const chartData =
      userStatusCount &&
      Object.keys(userStatusCount)
        .filter((key) => key == 'activeUsers' || key == 'inActiveUsers')
        .map((key: string) => ({
          name: ActiveInactiveUserCountName[key.toUpperCase()],
          value: userStatusCount[key as keyof IUserStatusCount],
          color: ActiveInactiveUserCountColor[key.toUpperCase()],
        }));
    return chartData;
  };

  const userCountChart = getUserStatusCountsDataset(
    selectedMonth,
    ChartEnum.UserCount
  );

  const approvedUsersChart = getUserStatusCountsDataset(
    selectedMonth,
    ChartEnum.ApprovedUsers
  );

  const rejectedUsersChart = getUserStatusCountsDataset(
    selectedMonth,
    ChartEnum.RejectedUsers
  );

  const registeredUsersChart = getUserStatusCountsDataset(
    selectedMonth,
    ChartEnum.RegisteredUser
  );

  const activeInactiveUsersChart = getActiveInactiveDataset();

  // trigger when user select the year
  const handleYearChange = (value: any) => {
    setSelectedYear(value);
  };

  // trigger when user select the month
  const handleMonthChange = (value: any) => {
    setSelectedMonth(value);
  };

  useEffect(() => {
    if (userStatusCountData) {
      setUserStatusCount(userStatusCountData.data);
    }
  }, [userStatusCountData]);

  useEffect(() => {
    if (userStatusCountByMonthData) {
      setUserStatusCountByMonth(userStatusCountByMonthData.data);
    }
  }, [userStatusCountByMonthData]);

  const largeScreen = useMediaQuery('(min-width: 1600px)');

  return (
    <Container
      display="flex"
      size="var(--mantine-container-width-admin)"
      pb={40}
      h="100%"
      style={{ flexDirection: 'column' }}
    >
      <Title order={2} my={20}>
        User Reports
      </Title>
      {/*start: cards */}
      <Grid gutter={largeScreen ? 30 : 20}>
        <GridCol span="auto">
          {/* start: pending request card */}
          <Anchor
            component={NavLink}
            to={`../${PftRoutes.PENDING_REQUESTS}`}
            className="navlink"
            underline="never"
            w={'100%'}
          >
            <ReportCards
              title="Pending Users"
              count={
                userStatusCount ? userStatusCount.pendingUsers.toString() : '0'
              }
              icon="icon-pending-users"
            />
          </Anchor>
          {/* end: pending request card */}
        </GridCol>
        <GridCol span="auto">
          {/* start: approved users card */}
          <Anchor
            component={NavLink}
            to={`../${PftRoutes.APPROVED_REQUESTS}`}
            className="navlink"
            underline="never"
          >
            <ReportCards
              title="Approved Users"
              count={
                userStatusCount ? userStatusCount.approvedUsers.toString() : '0'
              }
              icon="icon-approved-users"
            />
          </Anchor>
          {/* end: approved users card */}
        </GridCol>
        <GridCol span="auto">
          {/* start: rejected users card */}
          <Anchor
            component={NavLink}
            to={`../${PftRoutes.REJECTED_REQUESTS}`}
            className="navlink"
            underline="never"
          >
            <ReportCards
              title="Rejected Users"
              count={
                userStatusCount ? userStatusCount.rejectedUsers.toString() : '0'
              }
              icon="icon-rejected-users"
            />
          </Anchor>
          {/* end: rejected users card */}
        </GridCol>
        <GridCol span="auto">
          {/* start: active users card */}
          <Anchor
            component={NavLink}
            to={`../${PftRoutes.APPROVED_REQUESTS}`}
            className="navlink"
            underline="never"
          >
            <ReportCards
              title="Active Users"
              count={
                userStatusCount ? userStatusCount.activeUsers.toString() : '0'
              }
              icon="icon-active-users"
            />
          </Anchor>
          {/* end: active users card */}
        </GridCol>
        <GridCol span="auto">
          {/* start: inactive users card */}
          <Anchor
            component={NavLink}
            to={`../${PftRoutes.APPROVED_REQUESTS}`}
            className="navlink"
            underline="never"
          >
            <ReportCards
              title="Inactive Users"
              count={
                userStatusCount ? userStatusCount.inActiveUsers.toString() : '0'
              }
              icon="icon-inactive-users"
            />
          </Anchor>
          {/* end: inactive users card */}
        </GridCol>
      </Grid>
      {/*end: cards */}
      <Grid mt={largeScreen ? 30 : 20} styles={{ inner: { height: '100%' } }}>
        <GridCol span={8.5}>
          <Paper h={'100%'} p={14} px={30} radius="md" shadow="xs">
            <Flex justify="space-between" py={12}>
              <Title order={4}>Activity Charts</Title>
              {/* dropdown to perform filtering bu month and year */}
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

            <Grid h={'100%'} gutter={20}>
              <GridCol span={6}>
                {/* start: donut chart for displaying user status count*/}
                <Flex
                  h={'100%'}
                  style={{
                    border: '1px solid var(--mantine-border-color)',
                    borderRadius: '8px',
                  }}
                  direction={'column'}
                  px={20}
                  pt={20}
                >
                  <Title order={4} mb={20}>
                    User Count
                  </Title>
                  {userCountChart?.length &&
                  userCountChart.every((item) => item.value == 0) ? (
                    <Flex justify="center" h="100%">
                      <Image src={NoDonutData} height={176} width="auto" />
                    </Flex>
                  ) : (
                    <>
                      {userCountChart?.length && (
                        <Grid h={'100%'}>
                          <GridCol span={6}>
                            <Flex justify={'center'}>
                              <DonutChart
                                strokeWidth={0}
                                thickness={25}
                                size={158}
                                data={userCountChart}
                                withTooltip
                                tooltipProps={{
                                  content: (props) => (
                                    <CustomTooltip
                                      {...props}
                                      data={userCountChart}
                                    />
                                  ),
                                }}
                              />
                            </Flex>
                          </GridCol>
                          <GridCol span={6}>
                            <Flex
                              h={'100%'}
                              justify={'center'}
                              align={'center'}
                            >
                              <List style={{ flexGrow: 1 }} ms="xl">
                                {userCountChart?.length &&
                                  userCountChart.map((data: any) => (
                                    <ListItem
                                      key={data.name}
                                      icon={
                                        <ThemeIcon
                                          color={data.color}
                                          size={10}
                                          radius="xl"
                                        />
                                      }
                                      styles={{
                                        itemWrapper: { width: '100%' },
                                        itemLabel: { width: '100%' },
                                      }}
                                    >
                                      <Group gap={largeScreen ? 20 : 10}>
                                        <Text
                                          w={largeScreen ? 80 : 60}
                                          lh={2.1}
                                          fz="sm"
                                        >
                                          {data.name}
                                        </Text>
                                        <Text
                                          lh={2.1}
                                          fz="sm"
                                          fw="bold"
                                          ta="start"
                                        >
                                          {data.value}
                                        </Text>
                                      </Group>
                                    </ListItem>
                                  ))}
                              </List>
                            </Flex>
                          </GridCol>
                        </Grid>
                      )}
                    </>
                  )}
                </Flex>
                {/* end: donut chart for displaying user status count*/}
              </GridCol>
              <GridCol span={6}>
                {/* start: bar chart for displaying approved user count by month*/}
                <Flex
                  direction={'column'}
                  h={'100%'}
                  style={{
                    border: '1px solid var(--mantine-border-color)',
                    borderRadius: '8px',
                  }}
                  px={20}
                  pt={20}
                >
                  <Title order={4} mb={20}>
                    Approved Users By Month
                  </Title>

                  {approvedUsersChart?.length && approvedUsersChart[0].value ? (
                    <BarChart
                      h={176}
                      data={approvedUsersChart}
                      dataKey="name"
                      withBarValueLabel
                      withTooltip={false}
                      xAxisLabel="Month"
                      yAxisLabel="Approved Users"
                      strokeDasharray="0.5 0.5"
                      yAxisProps={{
                        opacity: 0.5,
                      }}
                      barProps={{
                        radius: [6, 6, 0, 0],
                      }}
                      barChartProps={{ barSize: 30 }}
                      series={[{ name: 'value', color: 'color' }]}
                      styles={{
                        axisLabel: {
                          textAnchor: 'middle',
                        },
                      }}
                    />
                  ) : (
                    <Flex justify="center" h="100%">
                      <Image src={NoBarData} height={176} width="auto" />
                    </Flex>
                  )}
                </Flex>
                {/* end: bar chart for displaying approved user count by month*/}
              </GridCol>
              <GridCol span={6}>
                {/* start: bar chart for displaying rejected user count by month*/}
                <Flex
                  direction={'column'}
                  h={'100%'}
                  style={{
                    border: '1px solid var(--mantine-border-color)',
                    borderRadius: '8px',
                  }}
                  px={20}
                  pt={20}
                >
                  <Title order={4} mb={20}>
                    Rejected Users By Month
                  </Title>
                  {rejectedUsersChart?.length && rejectedUsersChart[0].value ? (
                    <BarChart
                      h={176}
                      data={rejectedUsersChart}
                      dataKey="name"
                      withBarValueLabel
                      withTooltip={false}
                      xAxisLabel="Month"
                      yAxisLabel="Rejected Users"
                      strokeDasharray="0.5 0.5"
                      yAxisProps={{
                        opacity: 0.5,
                      }}
                      barProps={{
                        radius: [6, 6, 0, 0],
                      }}
                      barChartProps={{ barSize: 30 }}
                      series={[{ name: 'value', color: 'color' }]}
                      styles={{
                        axisLabel: {
                          textAnchor: 'middle',
                        },
                      }}
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
                {/* end: bar chart for displaying rejected user count by month*/}
              </GridCol>
              <GridCol span={6}>
                {/* start: bar chart for displaying registered user count by month*/}
                <Flex
                  direction={'column'}
                  h={'100%'}
                  style={{
                    border: '1px solid var(--mantine-border-color)',
                    borderRadius: '8px',
                  }}
                  px={20}
                  pt={20}
                >
                  <Title order={4} mb={20}>
                    Registered Users By Month
                  </Title>
                  {registeredUsersChart?.length &&
                  registeredUsersChart[0].value ? (
                    <BarChart
                      h={176}
                      data={registeredUsersChart}
                      dataKey="name"
                      withBarValueLabel
                      withTooltip={false}
                      xAxisLabel="Month"
                      yAxisLabel="Registered Users"
                      strokeDasharray="0.5 0.5"
                      yAxisProps={{
                        opacity: 0.5,
                      }}
                      barProps={{
                        radius: [6, 6, 0, 0],
                      }}
                      barChartProps={{ barSize: 30 }}
                      series={[{ name: 'value', color: 'color' }]}
                      styles={{
                        axisLabel: {
                          textAnchor: 'middle',
                        },
                      }}
                    />
                  ) : (
                    <Flex justify="center" h="100%">
                      <Image src={NoBarData} height={176} width="auto" />
                    </Flex>
                  )}
                </Flex>
                {/* end: bar chart for displaying registered user count by month*/}
              </GridCol>
            </Grid>
          </Paper>
        </GridCol>
        <GridCol span={3.5}>
          {/* start: pie chart for displaying active and inactive users count*/}
          <Paper radius="md" shadow="xs" px={30} py={14} h={'100%'}>
            <Flex h={'100%'} direction={'column'}>
              <Title order={4} pt={10} mb={16}>
                Active & Inactive Users
              </Title>
              {activeInactiveUsersChart?.length &&
              activeInactiveUsersChart.every((item) => item.value == 0) ? (
                <Flex justify="center" align="center" h="100%">
                  <Image src={NoPieData} width="100%" h={176} />
                </Flex>
              ) : (
                <Flex
                  h={'100%'}
                  align="center"
                  justify={'center'}
                  direction={'column'}
                >
                  {activeInactiveUsersChart?.length && (
                    <Stack gap={60}>
                      <PieChart
                        strokeWidth={0}
                        size={280}
                        data={activeInactiveUsersChart}
                        withTooltip
                        tooltipProps={{
                          content: (props) => (
                            <CustomTooltip
                              {...props}
                              data={activeInactiveUsersChart}
                            />
                          ),
                        }}
                      />
                      <List style={{ flexGrow: 1 }} ms="xl">
                        {activeInactiveUsersChart?.length &&
                          activeInactiveUsersChart.map((data, index) => (
                            <ListItem
                              key={index}
                              icon={
                                <ThemeIcon
                                  color={data.color}
                                  size={10}
                                  radius="xl"
                                />
                              }
                              styles={{
                                itemWrapper: { width: '100%' },
                                itemLabel: { width: '100%' },
                              }}
                            >
                              <Grid>
                                <GridCol span={8}>
                                  <Text lh={2.1} fz="sm">
                                    {data.name}
                                  </Text>
                                </GridCol>
                                <GridCol span={4}>
                                  <Text lh={2.1} fz="sm" fw="bold" ta="start">
                                    {data.value}
                                  </Text>
                                </GridCol>
                              </Grid>
                            </ListItem>
                          ))}
                      </List>
                    </Stack>
                  )}
                </Flex>
              )}
            </Flex>
          </Paper>
          {/* end: pie chart for displaying active and inactive users count*/}
        </GridCol>
      </Grid>
    </Container>
  );
};

export default UserReports;
