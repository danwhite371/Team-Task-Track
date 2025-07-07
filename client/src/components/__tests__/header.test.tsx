import type { OperationResult } from '@/types';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../header';
import mockFetch from '../../data/__mocks__/fetch';
import { AppDataContext, defaultContextValue } from '@/contexts/app-data-context';

global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

afterEach(() => {
  cleanup();
});

describe('Header', () => {
  it('should render', async () => {
    const mockHandleToggle = jest.fn();
    render(
      <AppDataContext.Provider value={defaultContextValue}>
        <Header handleNewTaskToggle={mockHandleToggle} />
      </AppDataContext.Provider>
    );
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
    const { rerender } = render(
      <AppDataContext.Provider value={defaultContextValue}>
        <Header handleNewTaskToggle={mockHandleToggle} />
      </AppDataContext.Provider>
    );
    let messageDiv = screen.getByTestId('message');
    expect(messageDiv).toBeEmptyDOMElement();

    const contextValue = { ...defaultContextValue, operationResult };
    rerender(
      <AppDataContext.Provider value={contextValue}>
        <Header handleNewTaskToggle={mockHandleToggle} />
      </AppDataContext.Provider>
    );
    messageDiv = screen.getByTestId('message');
    expect(messageDiv).toHaveTextContent(operationResult.message);
  });

  it('should change color if status changes to error', async () => {
    const mockHandleToggle = jest.fn();
    const operationResult: OperationResult = {
      status: 'success',
      message: 'Testing.',
    };
    const contextValue = { ...defaultContextValue, operationResult };
    const { rerender } = render(
      <AppDataContext.Provider value={contextValue}>
        <Header handleNewTaskToggle={mockHandleToggle} />
      </AppDataContext.Provider>
    );
    let messageDiv = screen.getByTestId('message');
    expect(messageDiv).toHaveClass('text-foreground');

    contextValue.operationResult.status = 'error';
    rerender(
      <AppDataContext.Provider value={contextValue}>
        <Header handleNewTaskToggle={mockHandleToggle} />
      </AppDataContext.Provider>
    );

    messageDiv = screen.getByTestId('message');
    expect(messageDiv).toHaveClass('text-destructive');
  });

  it('should toggle when New Task button is clicked', async () => {
    const mockHandleToggle = jest.fn();
    const operationResult: OperationResult = {
      status: 'success',
      message: 'Testing.',
    };
    const contextValue = { ...defaultContextValue, operationResult };
    render(
      <AppDataContext.Provider value={contextValue}>
        <Header handleNewTaskToggle={mockHandleToggle} />
      </AppDataContext.Provider>
    );
    const newTaskButton = screen.getByRole('button', { name: /New Task/i });
    fireEvent.click(newTaskButton);
    expect(mockHandleToggle).toHaveBeenCalledTimes(1);
  });
});
