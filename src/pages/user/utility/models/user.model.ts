/** Generic data type  */
export interface IDataRes<T> {
  data: T;
  message: string;
  error: string;
}

export interface IRes<T> {
  data: IDataRes<T>;
}

/** Model for transaction detail */
export interface ITransactionDetail {
  transactionId: number;
  categoryId: number;
  category: string;
  description: string;
  transactionDate: string;
  amount: string;
}

/** Model for income expense transaction */
export interface IExpenseIncomeRes {
  incomeExpenseDetails: ITransactionDetail[];
  totalRecordCount: number;
}

/** Model for TransactionDetails Response */
export interface ITransactionsDetailsRes {
  transactionsDetail: ITransactionDetail[];
  totalRecordCount: number;
}

/** Model for income expense request body */
export interface IExpenseIncomeReq {
  categoryId: string | number;
  amount: string | number;
  transactionDate: string | Date;
  description: string;
}

/** Model for CategoryItem */
export interface ICategoryItem {
  categoryId: number;
  category: string;
}

/** Model for Categories Response */
export interface ICategoriesRes {
  categoriesList: ICategoryItem[];
}

/** Model for ChangePassword RequestBody */
export interface IChangePasswordReq {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IEditUserProfile {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  genderId?: number | null;
  dateOfBirth?: string | null | Date;
  address?: string;
  image?: string;
  countryId?: number | string | null;
  stateId?: number | string | null;
  cityId?: number | string | null;
  pincode?: string;
}

export interface ITransactionsQueryParams {
  userId: number;
  categoryTypeId?: number;
  pageNumber: number;
  pageSize: number;
  month: number;
  year: number;
}

export interface IExportTransactionQueryParams {
  userId:number,
  year:number,
  month:number
}
export interface IExportTransaction{
  exportUrl:string,
  fileName:string
}

/** Model for UserData */
export interface IUserData {
  userId: number;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  userStatusId: number;
  roleId: number;
  subjectId: string;
  genderId: number;
  countryId: number;
  stateId: number;
  cityId: number;
  pincode: string;
  dateOfBirth: string | null;
  image: string;
  address: string;
}

export interface ICountryTypeRes {
  countriesList: ICountry[];
}

export interface ICountry {
  countryId: number | string;
  country: string;
  createdBy: number;
  createdDate: string;
}

export interface IStatesTypeRes {
  statesList: IState[];
}

export interface IState {
  stateId: number | string;
  state: string;
  countryId: number;
  createdBy: number;
  createdDate: string;
}

export interface ICitiesTypeRes {
  citiesList: ICity[];
}

export interface ICity {
  cityId: number | string;
  city: string;
  stateId: number;
  createdBy: number;
  createdDate: string;
}

export interface IDropdownData {
  value: string;
  label: string;
}

/** Model for total transactionData  */
export interface ITotalTransactionDataByMonth {
  categoryTypeId: number;
  categoryId: number;
  totalAmount: number;
  totalCount: number;
}

/** Model for dashboard details by month */
export interface IExpenseIncomeReports {
  totalTransactionData: ITotalTransactionDataByMonth[];
  totalExpense: number;
  totalIncome: number;
  availableBalance: number;
}

/** Model for total transaction data */
export interface ITotalTransactionDataByYear {
  month: number;
  totalIncome: number;
  totalExpense: number;
  availableBalance: number;
}

/** Model for dashboard details by year */
export interface IExpenseIncomeStatistics {
  totalTransactionData: ITotalTransactionDataByYear[];
}

/** Model for reminder request body */
export interface IReminderReq {
  value: string | number;
  title: string;
  reminderDate: string;
  reminderAlertId: string;
  notes: string;
}
/** Model for AlertItem */
export interface IAlertItem {
  reminderAlertId: number;
  reminderAlert: string;
  createdBy: number;
  createdDate: string;
}
/** Model for Alert Response */
export interface IAlertRes {
  reminderAlertList: IAlertItem[];
}
/** Model for ReminderListItem Response */
export interface IReminderListItem {
  reminderId: number;
  reminderTime: string;
  title: string;
}
/** Model for ReminderList Response */
export interface IReminderListRes {
  reminderList: IReminderListItem[];
}

export interface IReminderDetails {
  reminderId: number;
  value: number;
  title: string;
  reminderTime: string;
  reminderAlert: string;
  notes: string;
}

export interface IReminderCountDataRes {
 reminderCountData: IReminderCountData[]
}

export interface IReminderCountData {
  reminderDate: string;
  reminderCount: number;
}
