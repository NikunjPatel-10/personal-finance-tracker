import {
  Button,
  Flex,
  Modal,
  NumberInput,
  Select,
  Text,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

import { format } from 'date-fns';
import { useEffect } from 'react';
import {
  IncomeExpenseFormConstants,
  IncomeExpenseInitialValues,
} from '../../pages/user/utility/constants/incomeExpenseForm.constants';
import { CategoryType } from '../../pages/user/utility/constants/user.constant';
import {
  ICategoryItem,
  IExpenseIncomeReq,
} from '../../pages/user/utility/models/user.model';
import {
  useEditIncomeExpenseDataMutation,
  usePostIncomeExpenseDataMutation,
} from '../../pages/user/utility/services/user.service';
import { incomeExpenseFormValidationSchema } from '../../pages/user/utility/validations/incomeExpenseValidation';
import { useAppSelector } from '../../store/store';
interface IProps {
  opened: boolean;
  close: () => void;
  title: string;
  transactionId?: number;
  patchData?: IExpenseIncomeReq | null;
  category: ICategoryItem[];
  page: string;
}

export default function IncomeExpenseForm({
  opened,
  close,
  title,
  category,
  transactionId,
  patchData,
  page,
}: IProps) {
  const [incomeExpenseSubmit] = usePostIncomeExpenseDataMutation();
  const [editIncomeExpenseTransaction] = useEditIncomeExpenseDataMutation();

  const userId = useAppSelector((state) => state.auth.user?.userId);

  /** const for min and max date in calender */
  const today = new Date();
  const twoYearsAgo = new Date(today.getFullYear() - 2, 0, 1);

  const data = category.map((res) => ({
    value: res.categoryId.toString(),
    label: res.category,
  }));

  const incomeExpenseForm = useForm<IExpenseIncomeReq>({
    mode: 'uncontrolled',
    initialValues: { ...IncomeExpenseInitialValues },
    validate: yupResolver(incomeExpenseFormValidationSchema),
    validateInputOnChange: false,
    validateInputOnBlur: true,
  });

  // Patching Value to the form when its edit form
  useEffect(() => {
    if (patchData && Object.keys(patchData).length) {
      incomeExpenseForm.setValues({
        ...patchData,
        transactionDate: new Date(patchData.transactionDate),
      });
    }
    return () => {
      incomeExpenseForm.setValues({ ...IncomeExpenseInitialValues });
    };
  }, [patchData]);

  /**
   * This method is called on submit
   * @param values : values for submittion
   */
  const handleSubmit = (values: IExpenseIncomeReq) => {
    let incomeExpenseSubmitValues = { ...values };

    /** transform values */
    incomeExpenseSubmitValues.categoryId = Number(values.categoryId);
    incomeExpenseSubmitValues.transactionDate = format(
      values.transactionDate,
      'yyyy-MM-dd'
    );
    incomeExpenseSubmitValues.amount = Number(values.amount);

    /** api call as per the pages */
    if (page === CategoryType.INCOME) {
      if (!transactionId) {
        incomeExpenseSubmit({
          incomeExpenseData: incomeExpenseSubmitValues,
          categoryTypeId: 1,
          userId: userId,
        }).then((response: any) => {
          if ('data' in response) {
            if (response.data.message) {
              showNotification({
                title: 'Success',
                message: IncomeExpenseFormConstants.SUCCESS_TOASTER,
                color: 'green',
              });
              incomeExpenseForm.reset();
              close();
            } else {
              showNotification({
                title: 'Error',
                message: response.data?.error,
                color: 'red',
              });
            }
          }
        });
      } else {
        // API call for the edit transactions for income
        editIncomeExpenseTransaction({
          userId: userId,
          transactionId: Number(transactionId),
          incomeExpenseData: incomeExpenseSubmitValues,
        }).then((response: any) => {
          if ('data' in response) {
            if (response.data.message) {
              showNotification({
                title: 'Success',
                message: IncomeExpenseFormConstants.SUCCESS_TOASTER,
                color: 'green',
              });
              incomeExpenseForm.reset();
              close();
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
    }

    if (page === CategoryType.EXPENSE) {
      if (!transactionId) {
        incomeExpenseSubmit({
          incomeExpenseData: incomeExpenseSubmitValues,
          categoryTypeId: 2,
          userId: userId,
        }).then((response: any) => {
          if ('data' in response) {
            if (response.data.message) {
              showNotification({
                title: 'Success',
                message: IncomeExpenseFormConstants.SUCCESS_TOASTER,
                color: 'green',
              });
              incomeExpenseForm.reset();
              close();
            } else {
              showNotification({
                title: 'Error',
                message: response.data?.error,
                color: 'red',
              });
            }
          }
        });
      } else {
        // API call for the edit transactions for Expense
        editIncomeExpenseTransaction({
          userId: userId,
          transactionId: Number(transactionId),
          incomeExpenseData: incomeExpenseSubmitValues,
        }).then((response: any) => {
          if ('data' in response) {
            if (response.data.message) {
              showNotification({
                title: 'Success',
                message: IncomeExpenseFormConstants.SUCCESS_TOASTER,
                color: 'green',
              });
              incomeExpenseForm.reset();
              close();
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
    }
  };

  const handleClose = () => {
    close();
    incomeExpenseForm.reset();
  };

  return (
    <Modal
      size="xs"
      opened={opened}
      onClose={handleClose}
      title={title}
      centered
      radius={10}
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: 'bold',
        },
      }}
    >
      <form onSubmit={incomeExpenseForm.onSubmit(handleSubmit)}>
        <Select
          withAsterisk
          withCheckIcon={false}
          allowDeselect={false}
          label="Category"
          placeholder="Select Category"
          labelProps={{ style: { fontSize: '14px' } }}
          size="md"
          mb={'md'}
          key={incomeExpenseForm.key('categoryId')}
          {...incomeExpenseForm.getInputProps('categoryId')}
          data={data}
        />

        <NumberInput
          withAsterisk
          hideControls
          size="md"
          label="Amount"
          placeholder="Enter Value"
          leftSection={
            <Text component="span" fz={'18px'}>
              ₹
            </Text>
          }
          labelProps={{ style: { fontSize: '14px' } }}
          mb={'md'}
          key={incomeExpenseForm.key('amount')}
          {...incomeExpenseForm.getInputProps('amount')}
        />

        <DateInput
          withAsterisk
          valueFormat="MM-DD-YYYY"
          label="Date input"
          placeholder="Date input"
          maxDate={today}
          minDate={twoYearsAgo}
          rightSection={
            <Text component="span" fz={'18px'} className="icon-date"></Text>
          }
          rightSectionPointerEvents="none"
          labelProps={{ style: { fontSize: '14px' } }}
          size="md"
          mb={'md'}
          styles={{
            input: {
              cursor: 'pointer',
            },
          }}
          key={incomeExpenseForm.key('transactionDate')}
          {...incomeExpenseForm.getInputProps('transactionDate')}
        />

        <Textarea
          label={
            <>
              <Text component="span" fz="14px" fw={500} me={4}>
                Description
              </Text>
              <Text component="span" fz="14px" c={'#868e96'}>
                (Optional)
              </Text>
            </>
          }
          placeholder="Enter Description"
          labelProps={{ style: { fontSize: '14px' } }}
          mb={'md'}
          key={incomeExpenseForm.key('description')}
          {...incomeExpenseForm.getInputProps('description')}
          onBlur={(e) => {
            incomeExpenseForm.setFieldValue(
              'description',
              e.target.value.trim()
            );
            incomeExpenseForm.validateField('description');
          }}
        />

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
      </form>
    </Modal>
  );
}
