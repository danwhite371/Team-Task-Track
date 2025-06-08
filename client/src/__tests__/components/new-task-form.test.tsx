import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewTaskForm from '../../components/new-task-form';

afterEach(cleanup);

describe('newTaskForm', () => {
  it('should render', async () => {
    const mockCreateNewTask = jest.fn();
    render(<NewTaskForm createNewTask={mockCreateNewTask} />);
    expect(screen.getByRole('textbox', { name: /task name/i })).toBeTruthy();
  });

  it('should call createNewTask with new task name', async () => {
    const mockCreateNewTask = jest.fn();
    render(<NewTaskForm createNewTask={mockCreateNewTask} />);
    const inputElement = screen.getByRole('textbox', { name: /task name/i });
    await userEvent.type(inputElement, 'This is a test');
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    expect(mockCreateNewTask).toHaveBeenCalledTimes(1);
    expect(mockCreateNewTask).toHaveBeenCalledWith('This is a test');
  });

  it('should not submit when there is no text in the TaskName input', async () => {
    const mockCreateNewTask = jest.fn();
    render(<NewTaskForm createNewTask={mockCreateNewTask} />);
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    expect(mockCreateNewTask).not.toHaveBeenCalled();
  });
});
