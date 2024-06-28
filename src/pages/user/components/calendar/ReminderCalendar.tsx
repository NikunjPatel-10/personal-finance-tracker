import { Box, Container, Flex, Modal, Paper, Text, Title } from '@mantine/core';
import { Calendar, DatesProvider } from '@mantine/dates';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { format, formatDate } from 'date-fns';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../store/store';
import { ReminderFormConstants } from '../../utility/constants/calender.constant';
import { WEEKDAYS } from '../../utility/constants/user.constant';
import {
  IReminderCountData,
  IReminderListItem,
} from '../../utility/models/user.model';
import {
  useGetReminderCountByMonthQuery,
  useGetReminderListQuery,
  useLazyGetReminderCountByMonthQuery,
  useLazyGetReminderListQuery,
} from '../../utility/services/user.service';
import { Reminder } from './Reminder';
import ReminderForm from './ReminderForm';

export const ReminderCalendar = () => {
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedNextPrevDate, setSelectedNextPrevDate] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedCalenderDate, setSelectedCalenderDate] =
    useState<Date | null>();
  const [reminderList, setReminderList] = useState<IReminderListItem[]>([]);
  const [reminderCount, setReminderCount] = useState<IReminderCountData[]>([]);
  const [getReminderListTrigger] = useLazyGetReminderListQuery();
  const { data } = useGetReminderListQuery({
    userId: userId,
    year: selectedYear,
    month: selectedMonth,
    date: selectedDate,
  });
  const { data: reminderCountByMonth } = useGetReminderCountByMonthQuery({
    userId: userId,
    month: selectedMonth,
    year: selectedYear,
  });

  const [GetReminderCountByMonthTrigger] =
    useLazyGetReminderCountByMonthQuery();

  const largeScreen = useMediaQuery('(min-width: 1600px)');

  // Check the date with current date and apply class
  const checkDay = (date: Date) => {
    const todayDate = format(today, 'yyyy-MM-dd');
    const dateToCompare = format(date, 'yyyy-MM-dd');
    return dateToCompare >= todayDate ? 'next-day' : 'previous-day';
  };
  // Check selected date with current date and apply class
  const selectedDay = (date: Date) => {
    const dateToCompare = format(date, 'yyyy-MM-dd');
    const selected =
      selectedCalenderDate && format(selectedCalenderDate, 'yyyy-MM-dd');
    return dateToCompare === selected ? 'current-day' : '';
  };
  const onAddReminder = () => {
    open();
  };

  const getReminderList = (date: Date) => {
    setSelectedDate(date.getDate());
    setSelectedNextPrevDate(date.getDate());
    setSelectedMonth(date.getMonth() + 1);
    setSelectedYear(date.getFullYear());
    setSelectedCalenderDate(date);
  };

  useEffect(() => {
    if (userId) {
      if (!selectedDate && !selectedMonth && !selectedYear) {
        getReminderList(new Date());
      } else {
        getReminderListTrigger({
          userId,
          year: selectedYear,
          month: selectedMonth,
          date: selectedDate,
        }).then((res: any) => {
          if (res.data) {
            setReminderList(res.data.data.reminderList);
          }
        });
      }
    }
  }, [userId, selectedDate]);

  // Updating the reminderList
  useEffect(() => {
    if (data) {
      setReminderList(data.data.reminderList);
      if (selectedNextPrevDate === 0) {
        setReminderList([]);
      }
    }
  }, [data, selectedNextPrevDate]);
  useEffect(() => {
    if (reminderCountByMonth) {
      setReminderCount(reminderCountByMonth?.data.reminderCountData);
    }
  }, [reminderCount]);

  // Custom function to render days with leading zeros
  const renderDayProp = (date: Date) => {
    const dateToCompare = formatDate(date, 'dd-MM-yyyy');
    const day = date.getDate();
    const today = formatDate(new Date(), 'dd-MM-yyyy');
    const formattedDay = day < 10 ? `0${day}` : day;
    const isToday = dateToCompare === today;
    const dateToCompareForCount = formatDate(date, 'yyyy-MM-dd');

    return (
      <Flex
        direction={'column'}
        h={'100%'}
        w={'100%'}
        p={16}
        className={`date-cell ${checkDay(date)} ${selectedDay(date)}`}
        onClick={() => {
          getReminderList(date);
        }}
      >
        {/* display dates */}
        <Text
          style={{
            color: isToday ? 'red' : '#031837',
            opacity: '60%',
            fontWeight: 600,
          }}
          size={largeScreen ? '18px' : '16px'}
        >
          {formattedDay}
        </Text>
        {/* display reminder count */}
        {reminderCount &&
          reminderCount.map((res, index) => (
            <Flex
              key={index}
              mt={'8px'}
              align={'center'}
              justify={'center'}
              h={largeScreen ? '18px' : '14px'}
              w={
                res.reminderCount > 99
                  ? largeScreen
                    ? '30px'
                    : '18px'
                  : largeScreen
                  ? '18px'
                  : '14px'
              }
              style={{
                borderRadius: '50%',
                backgroundColor: '#2880FC',
                display:
                  res.reminderDate !== dateToCompareForCount ? 'none' : '',
              }}
            >
              {res.reminderDate === dateToCompareForCount && (
                <Text
                  m={'auto'}
                  c={'white'}
                  size={largeScreen ? '14px' : '10px'}
                >
                  {res.reminderCount}
                </Text>
              )}
            </Flex>
          ))}
        {/* reminder plus button */}

        <Box
          m="auto 0 0 auto"
          lh={0}
          className="add-reminder-btn"
          onClick={onAddReminder}
        >
          <Text
            component="span"
            className="icon-add-reminder"
            size={largeScreen ? '40px' : '22px'}
          >
            <span className="path1"></span>
            <span className="path2"></span>
          </Text>
        </Box>
      </Flex>
    );
  };

  // Trigger when user clicks on calendar previous button
  const handlePreviousMonthButton = (date: Date) => {
    let newMonth = date.getMonth() + 1;
    let newYear = date.getFullYear();

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    if (newYear == today.getFullYear() && newMonth == today.getMonth() + 1) {
      setSelectedNextPrevDate(today.getDate());
      setSelectedDate(today.getDate());
      setSelectedCalenderDate(today);
    } else {
      setSelectedNextPrevDate(0);
      setSelectedCalenderDate(null);
    }

    GetReminderCountByMonthTrigger({
      userId: userId,
      month: newMonth,
      year: newYear,
    });
  };

  // Trigger when user clicks on calendar next button
  const handleNextMonthButton = (date: Date) => {
    let newMonth = date.getMonth() + 1;
    let newYear = date.getFullYear();

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    if (newYear == today.getFullYear() && newMonth == today.getMonth() + 1) {
      setSelectedNextPrevDate(today.getDate());
      setSelectedDate(today.getDate());
      setSelectedCalenderDate(today);
    } else {
      setSelectedNextPrevDate(0);
      setSelectedCalenderDate(null);
    }

    GetReminderCountByMonthTrigger({
      userId: userId,
      month: newMonth,
      year: newYear,
    });
  };

  useEffect(() => {
    if (reminderCountByMonth) {
      setReminderCount(reminderCountByMonth.data.reminderCountData);
    }
  }, [reminderCountByMonth]);
  // const for displaying weekdays
  const weekdayFormat = (date: any) => {
    const dayIndex = date.getDay();
    return WEEKDAYS[dayIndex];
  };

  // const for min and max date in calender
  const today = new Date();
  const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), 1);

  // to add dynamic style to month day cells
  const monthCellStyle = {
    height: largeScreen ? '118px' : '88px',
    minWidth: largeScreen ? '124px' : '94px',
    padding: '0px',
  };

  return (
    <>
      <Container
        bg={'var(--mantine-color-gray)'}
        size={'var(--mantine-container-width-user)'}
        px={largeScreen ? 'xs' : '0px'}
        py={20}
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          flexGrow: 1,
        }}
      >
        {/* title of calendar */}
        <Title order={3}>Calendar</Title>
        <Flex
          mah={largeScreen ? '875px' : '720px'}
          mt="lg"
          // dir="column"
          h={'100%'}
        >
          <Paper
            bg={'white'}
            p={largeScreen ? 20 : 16}
            style={{ borderRadius: '8px' }}
            shadow="xs"
          >
            {/* start: Calendar */}
            <DatesProvider settings={{ firstDayOfWeek: 0 }}>
              <Calendar
                minDate={twoYearsAgo}
                weekdayFormat={weekdayFormat}
                renderDay={renderDayProp}
                onNextMonth={(date: Date) => {
                  handleNextMonthButton(date);
                }}
                onPreviousMonth={(date: Date) => {
                  handlePreviousMonthButton(date);
                }}
                previousIcon={<span className="icon-prew"></span>}
                nextIcon={<span className="icon-next"></span>}
                styles={{
                  monthCell: monthCellStyle,
                  day: {
                    height: '100%',
                    width: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    fontSize: '18px',
                  },
                  weekday: {
                    border: '1px solid #D9D9D9',
                    height: '60px',
                    width: '124px',
                    fontSize: '16px',
                    textAlign: 'left',
                    padding: '16px',
                    color: '#031837',
                    opacity: '60%',
                    fontWeight: 600,
                  },
                  calendarHeaderLevel: {
                    fontSize: '24px',
                    color: '#8694AA',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    pointerEvents: 'none',
                  },
                  calendarHeader: {
                    margin: '0px auto 20px auto',
                    minWidth: '440px',
                  },
                }}
              />
            </DatesProvider>
            {/* end: Calendar */}
          </Paper>
          <Box
            bg={'white'}
            w={'100%'}
            style={{
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            ml={largeScreen ? 'xl' : 'lg'}
            py={largeScreen ? '26px' : '20px'}
          >
            {/* title of Reminder panel */}
            <Title
              size={'20px'}
              mb={largeScreen ? 30 : 15}
              px={largeScreen ? 26 : 20}
            >
              Reminders
            </Title>
            {/* start: add reminders */}
            <Reminder
              reminderList={reminderList}
              reminderDate={selectedCalenderDate}
            />
            {/* end: add reminders */}
          </Box>
        </Flex>
      </Container>
      <Modal
        size="658px"
        opened={opened}
        onClose={close}
        title={ReminderFormConstants.ADD_REMINDER.FORM_TITLE}
        centered
        radius={10}
        styles={{
          title: {
            fontSize: '24px',
            fontWeight: 'bold',
          },
        }}
        closeButtonProps={{
          icon: (
            <Text
              component="span"
              size="20px"
              className="icon-close"
              c="var(--mantine-color-grey)"
              onClick={close}
            ></Text>
          ),
        }}
        overlayProps={{
          backgroundOpacity: 0.75,
          blur: 3,
        }}
      >
        <ReminderForm reminderDate={selectedCalenderDate} close={close} />
      </Modal>
    </>
  );
};
