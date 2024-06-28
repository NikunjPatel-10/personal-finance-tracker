export interface IUserData {
  userId: 0;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  userStatusId: 0;
  isActive: boolean;
  roleId: 0;
  rejectionReason?: string;
  modifiedDate?: string;
}

export interface IUserListRes {
  usersList: IUserData[];
  totalRecordCount: number;
}

export interface IUserListQueryParams {
  statusId: number;
  pageNumber: number;
  pageSize: number;
  SearchParam?: string;
}

export interface IUpdateUserStatusParams {
  userId: number;
  isActive: boolean;
}
export interface IUserDetailsParams {
  userId: number;
}

export interface IRejectionModalForm {
  rejectionReason: string;
}

export interface INotificationRes {
  notificationList: INotification[];
  unreadNotificationCount: number | null;
}

export interface INotification {
  firstName: string;
  notificationContent: string;
  emailId: string;
  createdDate: string;
  isRead: boolean;
}

export interface IUserStatusCount {
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  activeUsers: number;
  inActiveUsers: number;
}
export interface IUserStatusCountByMonth {
  approvedUsers: number;
  pendingUsers: number;
  registeredUsers: number;
  rejectedUsers: number;
}
