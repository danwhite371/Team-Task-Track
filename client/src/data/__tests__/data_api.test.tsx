import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataApi from '../data_api';
import { createTaskRequest, tasks } from '../__fixtures__/test_data';
import mockFetch from '../__mocks__/fetch';
import { CONSTANTS } from '@/constants';
import { dataUtils } from '../data-utils';

const { results } = dataUtils;

global.fetch = mockFetch;
const mockUpdateTaskData = jest.fn();
const mockUpdateOperationResult = jest.fn();
const taskResponse = tasks[0];

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

    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );
    expect(mockUpdateTaskData).toHaveBeenCalledWith(
      expect.objectContaining([taskResponse])
    );

    console.log(
      'results.loadingLoading',
      JSON.stringify(results.loadingLoading)
    );

    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(results.loadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(results.taskLoadingSuccess)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(results.loadingConnection)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining(results.taskCreatedSuccess)
    );
  });

  it('should call updateOperationResult with an error when the task has an empty name.', async () => {
    await dataApi.createNewTask('');
    createTaskRequest.variables.name = '';
    expect(global.fetch).toHaveBeenCalledWith(
      CONSTANTS.GRAPHQL_URL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(createTaskRequest),
      })
    );

    mockUpdateTaskData.mock.calls.forEach((call, index) => {
      console.log(`Call ${index + 1}:`, call);
    });
    console.log('mockUpdateOperationResult');
    mockUpdateOperationResult.mock.calls.forEach((call, index) => {
      console.log(`Call ${index + 1}:`, call);
    });

    expect(mockUpdateTaskData).toHaveBeenCalledWith(
      expect.objectContaining([])
    );

    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(results.loadingLoading)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(results.taskLoadingSuccess)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining(results.loadingConnection)
    );
    expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining(results.taskCreatedError)
    );
  });
});
