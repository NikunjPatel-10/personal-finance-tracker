import { IColumn } from '../../../shared/utility/models/shared.model';

export const pendingRequestTableDataColumns: IColumn[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'emailId', label: 'Email' },
  { key: 'phoneNumber', label: 'Mobile No.' },
];

export const rejectedRequestTableDataColumns: IColumn[] = [
  { key: 'statusTimestamp', label: 'Date and Time' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'emailId', label: 'Email' },
  { key: 'phoneNumber', label: 'Mobile No.' },
  { key: 'rejectionReason', label: 'Reason for Rejection' },
];
export const approvedRequestTableDataColumns: IColumn[] = [
  { key: 'statusTimestamp', label: 'Date and Time' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'emailId', label: 'Email' },
  { key: 'phoneNumber', label: 'Mobile No.' },
];
