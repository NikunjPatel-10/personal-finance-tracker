export interface IApiResponse {
  Status: boolean;
  Message: string;
}

export interface IBase<T> {
  Status: boolean;
  Message: string;
  Data: T;
  ApiResponse: IApiResponse;
}

export interface IColumn {
  key: string;
  label: string;
}
