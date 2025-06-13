import type { OperationResult } from '@/types';

const LoadingLoading: OperationResult = {
  status: 'loading',
  message: 'Loading...',
};
const taskLoadingSuccess: OperationResult = {
  status: 'success',
  message: 'Tasks loaded.',
};

const loadingConnection: OperationResult = {
  status: 'loading',
  message: 'Connecting...',
};
const taskCreatedSuccess: OperationResult = {
  status: 'success',
  message: 'Task created.',
};
const taskCreatedError: OperationResult = {
  status: 'error',
  message: 'Task name cannot be empty.',
};

export {
  LoadingLoading,
  taskLoadingSuccess,
  loadingConnection,
  taskCreatedSuccess,
  taskCreatedError,
};
