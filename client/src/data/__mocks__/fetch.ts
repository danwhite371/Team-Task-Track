import { createTaskResponse } from '../__tests__/__fixtures__/task-response';
import { dataUtils } from '../data-utils';
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
      json: () => Promise.resolve({ data: { getAllTasks: [] } }),
    }) as Promise<Response>;
  }

  return Promise.reject(new Error('Unhandled query in mockFetch'));
});

export default mockFetch;
