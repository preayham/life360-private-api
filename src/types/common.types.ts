export interface Life360Response<Data> {
  status: number;
  statusText: string;
  headers: Response['headers'];
  data?: Data;
}
