import type { OperationResult } from '@/types';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../header';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Header', () => {
  it('should render', async () => {
    const mockHandleToggle = jest.fn();
    render(<Header operationResult={undefined} handleNewTaskToggle={mockHandleToggle} />);
    expect(screen.getByText(/Team Task Track/i)).toBeTruthy();
    const messageDiv = screen.getByTestId('message');
    expect(messageDiv).toBeEmptyDOMElement();
    const newTaskButton = screen.getByRole('button', { name: /New Task/i });
    expect(newTaskButton).toBeTruthy();
  });

  it('should update message on operationResult change', async () => {
    const mockHandleToggle = jest.fn();
    const operationResult: OperationResult = {
      status: 'success',
      message: 'Testing.',
    };
    const { rerender } = render(<Header operationResult={undefined} handleNewTaskToggle={mockHandleToggle} />);
    let messageDiv = screen.getByTestId('message');
    expect(messageDiv).toBeEmptyDOMElement();
    rerender(<Header operationResult={operationResult} handleNewTaskToggle={mockHandleToggle} />);
    messageDiv = screen.getByTestId('message');
    expect(messageDiv).toHaveTextContent(operationResult.message);
  });

  it('should change color if status changes to error', async () => {
    const mockHandleToggle = jest.fn();
    const operationResult: OperationResult = {
      status: 'success',
      message: 'Testing.',
    };
    const { rerender } = render(<Header operationResult={operationResult} handleNewTaskToggle={mockHandleToggle} />);
    let messageDiv = screen.getByTestId('message');
    expect(messageDiv).toHaveClass('text-foreground');
    operationResult.status = 'error';
    rerender(<Header operationResult={operationResult} handleNewTaskToggle={mockHandleToggle} />);
    messageDiv = screen.getByTestId('message');
    expect(messageDiv).toHaveClass('text-destructive');
  });

  it('should toggle when New Task button is clicked', async () => {
    const mockHandleToggle = jest.fn();
    const operationResult: OperationResult = {
      status: 'success',
      message: 'Testing.',
    };
    render(<Header operationResult={operationResult} handleNewTaskToggle={mockHandleToggle} />);
    const newTaskButton = screen.getByRole('button', { name: /New Task/i });
    fireEvent.click(newTaskButton);
    expect(mockHandleToggle).toHaveBeenCalledTimes(1);
  });
});
