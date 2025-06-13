import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataApi from '../data_api';
import {
  createTaskRequest,
  createTaskResponse,
} from '../__fixtures__/test_data';
import mockFetch from '../__mocks__/fetch';
import {
  LoadingLoading,
  taskLoadingSuccess,
  loadingConnection,
  taskCreatedSuccess,
  taskCreatedError,
} from '../data_results';

global.fetch = mockFetch;
const mockUpdateTaskData = jest.fn();
const mockUpdateOperationResult = jest.fn();
const taskResponse = createTaskResponse.data.createTask;

let dataApi: DataApi;

beforeEach(() => {
  jest.clearAllMocks();
  dataApi = new DataApi(mockUpdateTaskData, mockUpdateOperationResult);
});

afterEach(() => {
  cleanup();
});

describe('dataApi', () => {
  it('should create a new Task', async () => {
    await dataApi.createNewTask(taskResponse.name);
    console.log('mockUpdateTaskData');
    mockUpdateTaskData.mock.calls.forEach((call, index) => {
      console.log(`Call ${index + 1}:`, call);
    });
    console.log('mockUpdateOperationResult');
    mockUpdateOperationResult.mock.calls.forEach((call, index) => {
      console.log(`Call ${index + 1}:`, call);
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );
    expect(mockUpdateTaskData).toHaveBeenCalledWith(
      expect.objectContaining([taskResponse])
    );

    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(LoadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(taskLoadingSuccess)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(loadingConnection)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining(taskCreatedSuccess)
    );
  });

  it('should call updateOperationResult with an error when the task has an empty name.', async () => {
    await dataApi.createNewTask('');
    createTaskRequest.variables.name = '';
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );

    expect(mockUpdateTaskData).toHaveBeenCalledWith(
      expect.objectContaining([])
    );

    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(LoadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(taskLoadingSuccess)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(loadingConnection)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining(taskCreatedError)
    );
  });
});
