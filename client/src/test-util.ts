import { useEffect } from 'react';
import { useAppData } from './contexts/app-data-context';
import type { OperationResult, Task } from './types';

function logMockCalls(mocked: jest.Mock<any, any, any>, label: string) {
  console.log(label);
  mocked.mock.calls.forEach((call, index) => {
    console.log(`Call ${index + 1}:`, call);
  });
}

function expectNthCalledWith(mocked: jest.Mock<any, any, any>, nth: number, containing: any) {
  expect(mocked).toHaveBeenNthCalledWith(nth, expect.objectContaining(containing));
}

interface TestCompProps {
  updateOperationResult(operationResult?: OperationResult): void;
  updateTasks(tasks: Task[]): void;
}
function TestComponent({ updateOperationResult, updateTasks }: TestCompProps) {
  const { tasks, operationResult } = useAppData();
  useEffect(() => {
    if (tasks.length > 0) {
      updateTasks(tasks);
    }
  }, [tasks, updateTasks]);
  useEffect(() => {
    if (operationResult != undefined) {
      updateOperationResult(operationResult);
    }
  }, [operationResult, updateOperationResult]);
  return null;
}

export { logMockCalls, expectNthCalledWith, TestComponent };
