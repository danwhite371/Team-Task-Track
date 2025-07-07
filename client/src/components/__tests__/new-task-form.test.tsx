import { render, cleanup, fireEvent, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewTaskForm from '../../components/new-task-form';
import { AppDataProvider } from '@/contexts/app-data-context';
import mockFetch from '@/data/__mocks__/fetch';
import { logMockCalls, TestComponent } from '@/test-util';
import { CONSTANTS } from '@/constants';
import { dataUtils } from '@/data/data-utils';

global.fetch = mockFetch;

const mockUpdateTasks = jest.fn();
const mockUpdateOperationResult = jest.fn();

const { results } = dataUtils;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('newTaskForm', () => {
  it('should render', async () => {
    render(
      <AppDataProvider>
        <NewTaskForm />
      </AppDataProvider>
    );
    expect(screen.getByRole('textbox', { name: /task name/i })).toBeTruthy();
  });

  it('should call createNewTask with new task name', async () => {
    render(
      <AppDataProvider>
        <NewTaskForm />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    const name = 'This is a test';
    const inputElement = screen.getByRole('textbox', { name: /task name/i });
    await userEvent.type(inputElement, name);
    act(() => {
      fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockUpdateTasks).toHaveBeenCalledTimes(1);
      expect(mockUpdateTasks).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: name })]));
      expect(mockUpdateOperationResult).toHaveBeenCalledTimes(2);
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(1, expect.objectContaining(results.loadingConnection));
      expect(mockUpdateOperationResult).toHaveBeenNthCalledWith(2, expect.objectContaining(results.taskCreatedSuccess));
    });

    logMockCalls(mockFetch, 'mockFetch: line 82');
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(CONSTANTS.GRAPHQL_URL);
    expect(options?.method).toBe('POST');
    expect(options?.headers).toEqual({
      'content-type': 'application/json',
    });
    const requestBody = JSON.parse(options?.body as string);
    expect(requestBody.query).toBeDefined();
    expect(requestBody.variables).toEqual({ name });
    logMockCalls(mockUpdateTasks, 'mockUpdateTasks: line 92');
    logMockCalls(mockUpdateOperationResult, 'mockUpdateOperationResult: line 93');
  });

  it('should not submit when there is no text in the TaskName input', async () => {
    render(
      <AppDataProvider>
        <NewTaskForm />
        <TestComponent updateTasks={mockUpdateTasks} updateOperationResult={mockUpdateOperationResult} />
      </AppDataProvider>
    );
    act(() => {
      fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      screen.getByText(CONSTANTS.messages.taskNameRequired);
    });
    expect(mockUpdateTasks).not.toHaveBeenCalled();
    expect(mockUpdateOperationResult).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
