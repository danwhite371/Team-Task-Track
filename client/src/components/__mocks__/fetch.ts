import { createTaskResponse } from '@/data/__tests__/__fixtures__/task-response';
import { dataUtils } from '@/data/data-utils';
import { tasks, allTaskTimes } from '../__tests__/until';
const {
  results: { taskCreatedError },
} = dataUtils;

const mockFetch = jest.fn();
mockFetch.mockImplementation(async (_url: string, options?: RequestInit) => {
  const requestBody = JSON.parse(options?.body as string);
  console.log('requestBody.variables\n', requestBody.variables);

  if ((requestBody.query as string).includes('mutation CreateTask')) {
    if (!requestBody.variables.name) {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            errors: [{ message: taskCreatedError.message }],
          }),
      }) as Promise<Response>;
    } else {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(createTaskResponse),
      }) as Promise<Response>;
    }
  } else if ((requestBody.query as string).includes('query GetAllTasks')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { getAllTasks: tasks } }),
    }) as Promise<Response>;
  } else if ((requestBody.query as string).includes('query GetTaskTimes')) {
    if (!requestBody.variables)
      throw new Error('Request body for GetTaskTimes has no variables');
    const taskId = requestBody.variables.taskId;
    if (!taskId) throw new Error('variables for GetTaskTimes has no taskId');
    const taskTimes = allTaskTimes.filter((tt) => tt.taskId == taskId);
    if (taskTimes == undefined)
      throw new Error(`Could not find taskTimes for taskId: '${taskId}'`);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { getTaskTimes: taskTimes } }),
    }) as Promise<Response>;
  } else if ((requestBody.query as string).includes('mutation StartTask')) {
    console.log('mockFetch - mutation StartTask');
    if (!requestBody.variables)
      throw new Error('Request body for StartTask has no variables');
    const id = requestBody.variables.id;
    if (!id) throw new Error('variables for StartTask has no id');
    const task = tasks.find((t) => t.id == id);
    if (!task) throw new Error(`Task was not found for id: ${id}`);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { startTask: task } }),
    }) as Promise<Response>;
  } else if ((requestBody.query as string).includes('mutation StopTask')) {
    console.log('mockFetch - mutation StopTask');
    if (!requestBody.variables)
      throw new Error('Request body for StopTask has no variables');
    const id = requestBody.variables.id;
    if (!id) throw new Error('variables for StopTask has no id');
    const task = tasks.find((t) => t.id == id);
    if (!task) throw new Error(`Task was not found for id: ${id}`);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { stopTask: task } }),
    }) as Promise<Response>;
  }

  return Promise.reject(new Error('Unhandled query in mockFetch'));
});

export default mockFetch;
