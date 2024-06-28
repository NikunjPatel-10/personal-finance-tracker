import { IColumn } from '../../../shared/utility/models/shared.model';

export const expenseTableDataColumns: IColumn[] = [
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'transactionDate', label: 'Date' },
  { key: 'amount', label: 'Amount' },
];
