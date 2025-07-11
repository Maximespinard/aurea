import { AxiosError } from 'axios';

export type ApiError = AxiosError<{
  message?: string;
  error?: string;
  statusCode?: number;
}>;