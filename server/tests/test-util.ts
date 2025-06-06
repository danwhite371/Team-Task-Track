import { Task } from '../src/types';

function mockPino() {
  jest.mock('pino', () => {
    const mockPino: any = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn(() => mockPino),
    };
    return jest.fn(() => mockPino);
  });
}

async function checkTask(
  task: Task,
  name: string,
  id?: number | undefined
): Promise<void> {
  console.log(JSON.stringify(task));
  const updatedAt = new Date(task.updatedAt);
  const lastTime = new Date(task.lastTime!);
  if (task == undefined) throw new Error('Data is undefined');
  id != undefined && expect(task.id).toBe(id);
  expect(task.name).toBe(name);
  expect(task.active).toBe(false);
  expect(task.duration).toBe(null);
  expect(task.secondsDuration).toBe(null);
  expect(updatedAt.getTime()).toBe(lastTime.getTime());
}

export { mockPino, checkTask };
