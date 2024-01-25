export interface AccountRepositoryRequestOTPResponse {
  data?: {
    transactionId: string;
    phone: string;
  };
  error?: {
    code: string;
  };
}
