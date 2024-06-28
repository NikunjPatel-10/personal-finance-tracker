import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import IncomeExpenseForm from '../../../../shared/components/IncomeExpenseForm';
import { useAppSelector } from '../../../../store/store';
import { Title } from '../../utility/constants/incomeExpenseForm.constants';
import { CategoryTypeEnum } from '../../utility/enum/user.enum';
import {
  ICategoryItem,
  ITransactionDetail,
} from '../../utility/models/user.model';
import { useGetCategoryItemQuery } from '../../utility/services/user.service';
import ExpenseList from './ExpenseList';

export default function Expense() {
  const [categoriesItem, setCategoriesItem] = useState<ICategoryItem[]>([]);

  const userId = useAppSelector((state) => state.auth.user?.userId);

  const { data: res } = useGetCategoryItemQuery(CategoryTypeEnum.Expense);

  // Selected Data for edit
  const [selectedEditData, setSelectedEditData] =
    useState<ITransactionDetail | null>(null);

  const patchData = selectedEditData && {
    categoryId: selectedEditData?.categoryId.toString(),
    transactionDate: selectedEditData?.transactionDate,
    amount: selectedEditData.amount,
    description: selectedEditData.description,
  };

  const [opened, { open, close }] = useDisclosure(false);
  function openAddExpenseModal() {
    open();
  }

  // Open form as edit form and setting set data for patching
  function openEditExpenseModal(transaction: ITransactionDetail) {
    open();
    setSelectedEditData(transaction);
  }

  function handleFormClose() {
    close();
    // setting time out for wait till transition end
    setTimeout(() => {
      setSelectedEditData(null);
    }, 350);
  }

  useEffect(() => {
    if (res) {
      setCategoriesItem(res.data.categoriesList);
    }
  }, [res]);

  return (
    <>
      {userId && (
        <ExpenseList
          openAddExpenseModal={openAddExpenseModal}
          openEditExpenseModal={openEditExpenseModal}
          userId={userId}
        />
      )}
      <IncomeExpenseForm
        opened={opened}
        transactionId={selectedEditData?.transactionId}
        patchData={patchData}
        close={handleFormClose}
        title={selectedEditData ? Title.EDIT_EXPENSE : Title.ADD_EXPENSE}
        category={categoriesItem}
        page={'Expense'}
      />
    </>
  );
}
