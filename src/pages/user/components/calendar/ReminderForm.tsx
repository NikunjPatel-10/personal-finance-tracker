import {
  ActionIcon,
  Button,
  Flex,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { format, formatDate } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../../store/store';
import { ReminderInitialValues } from '../../utility/constants/calender.constant';
import { IReminderReq } from '../../utility/models/user.model';
import {
  useGetAlertItemQuery,
  usePostReminderDataMutation,
  usePutReminderDataMutation,
} from '../../utility/services/user.service';
import { reminderFormValidationSchema } from '../../utility/validations/calenderReminder.validation';

interface IProps {
  reminderDate: Date | undefined | null;
  close: () => void;
  patchData?: any;
  reminderId?: number;
}
export default function ReminderForm({
  reminderDate,
  close,
  patchData,
  reminderId,
}: IProps) {
  const [alertItem, setAlertItem] = useState<any>([]);
  const { data: res } = useGetAlertItemQuery();
  const [addReminderSubmit] = usePostReminderDataMutation();
  const [editReminderSubmit] = usePutReminderDataMutation();
  const [minTime, setMinTime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const reminderForm = useForm({
    initialValues: {
      ...ReminderInitialValues,
    },
    validate: yupResolver(reminderFormValidationSchema),
    validateInputOnChange: false,
    validateInputOnBlur: true,
  });
  const convertToIST = (reminderDate: Date, reminderTime: string) => {
    const day = reminderDate.getDate();
    const month = reminderDate.getMonth();
    const year = reminderDate.getFullYear();
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const localDate = new Date(year, month, day, hours, minutes);

    localDate.setHours(localDate.getHours() + 5);
    localDate.setMinutes(localDate.getMinutes() + 30);

    return localDate.toISOString();
  };
  /**
   * This method is called on submit
   * @param values : values for submittion
   */
  const handleSubmit = (values: IReminderReq) => {
    let reminderSubmitValues = { ...values };
    /** transform values */
    reminderSubmitValues.value = Number(values.value);
    reminderSubmitValues.reminderDate = convertToIST(
      reminderDate!,
      reminderSubmitValues.reminderDate
    );

    /** api call */
    if (reminderId) {
      editReminderSubmit({
        userId: userId,
        reminderId: reminderId,
        reminderData: reminderSubmitValues,
      }).then((response: any) => {
        if ('data' in response) {
          if (response.data.message) {
            reminderForm.reset();
            close();
          }
        }
      });
    } else {
      addReminderSubmit({
        userId: userId,
        reminderData: reminderSubmitValues,
      }).then((response: any) => {
        if ('data' in response) {
          if (response.data.message) {
            showNotification({
              title: 'Success',
              message: response.data.message,
              color: 'green',
            });
            reminderForm.reset();
            close();
          }
        }
      });
    }
  };
  const handleClose = () => {
    close();
    reminderForm.reset();
  };

  const convertTimeTo24HrFormat = (time: string) => {
    // Parse the time and period (AM/PM)
    let [timePart, period] = time.split(' ');
    // split the time part into hours and minutes
    let [hours, minutes] = timePart.split(':').map(Number);
    // Convert hours to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    // Format the hours and minutes as two digits
    let formattedHours = hours.toString().padStart(2, '0');
    let formattedMinutes = minutes.toString().padStart(2, '0');
    return formattedHours + ':' + formattedMinutes;
  };
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Function to get current time formatted as HH:mm
    const getCurrentTime = () => {
      return format(new Date(), 'HH:mm');
    };

    // Set minTime to current time
    const now = getCurrentTime();
    setMinTime(now);
  }, []); // Empty dependency array ensures this runs once on component mount

  const handleTimeChange = (event: any) => {
    const time = event.target.value;
    const currentTime = new Date(`1970-01-01T${minTime}:00`);
    const selectedTime = new Date(`1970-01-01T${time}:00`);
    const date = new Date();
    if (
      selectedTime < currentTime &&
      reminderDate &&
      formatDate(reminderDate, 'dd-MM-yyyy') === formatDate(date, 'dd-MM-yyyy')
    ) {
      setError(`Time must be later than ${minTime}`);
    } else {
      setError(null);
      reminderForm.setFieldValue('reminderDate', time);
      reminderForm.validateField('reminderDate');
    }
  };
  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
      fz={'18px'}
    >
      <span className="icon icon-time" style={{ fontSize: '18px' }} />
    </ActionIcon>
  );
  useEffect(() => {
    if (res) {
      const data = res.data.reminderAlertList.map((res: any) => ({
        value: res.reminderAlertId.toString(),
        label: res.reminderAlert,
      }));
      setAlertItem(data);
    }
  }, [res]);

  // Patching Value to the form when its edit form
  useEffect(() => {
    if (patchData && Object.keys(patchData).length) {
      reminderForm.setValues({
        ...patchData,
        reminderDate: convertTimeTo24HrFormat(patchData.reminderTime),
        reminderAlertId: patchData.reminderAlertId.toString(),
      });
    }
    return () => {
      reminderForm.setValues({ ...ReminderInitialValues });
    };
  }, [patchData]);
  const largeScreen = useMediaQuery('(min-width: 1600px)');
  return (
    <>
      <form onSubmit={reminderForm.onSubmit(handleSubmit)}>
        <Flex gap={8}>
          <NumberInput
            size={largeScreen ? 'lg' : 'md'}
            w={'50%'}
            hideControls
            withAsterisk
            mb="md"
            label="Value"
            placeholder="Enter Value"
            labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
            key={reminderForm.key('value')}
            {...reminderForm.getInputProps('value')}
            onBlur={(e) => {
              reminderForm.setFieldValue('value', e.target.value.trim());
              reminderForm.validateField('value');
            }}
          />
          <TextInput
            size={largeScreen ? 'lg' : 'md'}
            w={'50%'}
            withAsterisk
            mb="md"
            label="Title"
            placeholder="Enter Title"
            labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
            key={reminderForm.key('title')}
            {...reminderForm.getInputProps('title')}
            onBlur={(e) => {
              reminderForm.setFieldValue('title', e.target.value.trim());
              reminderForm.validateField('title');
            }}
          />
        </Flex>
        <Flex gap={8}>
          <TimeInput
            size={largeScreen ? 'lg' : 'md'}
            w={'50%'}
            withAsterisk
            mb="md"
            label="Time"
            placeholder="Select Time"
            labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
            ref={ref}
            rightSection={pickerControl}
            key={reminderForm.key('reminderDate')}
            minTime={minTime}
            {...reminderForm.getInputProps('reminderDate')}
            onChange={handleTimeChange}
            onBlur={(e) => {
              const selectedTime = e.target.value.trim();
              reminderForm.setFieldValue('reminderDate', selectedTime);
              reminderForm.validateField('reminderDate');
            }}
          />
          <Select
            size={largeScreen ? 'lg' : 'md'}
            w={'50%'}
            withAsterisk
            withCheckIcon={false}
            label="Alert"
            placeholder="Select"
            labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
            mb="md"
            key={reminderForm.key('reminderAlertId')}
            {...reminderForm.getInputProps('reminderAlertId')}
            data={alertItem}
          />
        </Flex>
        <Textarea
          size={largeScreen ? 'lg' : 'md'}
          label={
            <>
              <Text component="span" fz="14px" fw={500} me={4}>
                Notes
              </Text>
              <Text component="span" fz="14px" c={'#868e96'}>
                (Optional)
              </Text>
            </>
          }
          placeholder="Enter Note"
          mb="md"
          labelProps={{ style: { fontSize: '14px', marginBottom: '5px' } }}
          key={reminderForm.key('notes')}
          {...reminderForm.getInputProps('notes')}
          onBlur={(e) => {
            reminderForm.setFieldValue('notes', e.target.value.trim());
            reminderForm.validateField('notes');
          }}
        />
        {/* start: button group */}
        <Flex gap={8} justify={'flex-end'}>
          <Button
            variant="outline"
            tt={'uppercase'}
            size="md"
            lts={2}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit" tt={'uppercase'} size="md" lts={2}>
            Save
          </Button>
        </Flex>
        {/* end: button group */}
      </form>
    </>
  );
}
