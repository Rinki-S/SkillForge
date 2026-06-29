import axios, { AxiosError } from 'axios';
import { clearStoredUser, clearToken, getToken } from '../lib/authStorage';

interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export class ApiError extends Error {
  code?: number;
  status?: number;

  constructor(message: string, code?: number, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const body = response.data as Result<unknown>;
    if (body && typeof body === 'object' && 'code' in body && 'message' in body) {
      if (body.code !== 200) {
        if (body.code === 4010) {
          clearToken();
          clearStoredUser();
        }
        throw new ApiError(body.message || '请求失败', body.code, response.status);
      }
      return body.data;
    }
    return response.data;
  },
  (error: AxiosError<Result<unknown>>) => {
    const code = error.response?.data?.code;
    const message = error.response?.data?.message || error.message || '网络请求失败';
    if (code === 4010 || error.response?.status === 401) {
      clearToken();
      clearStoredUser();
    }
    return Promise.reject(new ApiError(message, code, error.response?.status));
  },
);

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return '操作失败，请稍后重试';
}
