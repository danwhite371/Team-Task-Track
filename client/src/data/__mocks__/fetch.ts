import { createTaskResponse } from '../__fixtures__/test_data';

const mockFetch = jest.fn();
mockFetch.mockImplementation(async (_url: string, options?: RequestInit) => {
  const requestBody = JSON.parse(options?.body as string);
  console.log('requestBody.variables\n', requestBody.variables);
  if ((requestBody.query as string).includes('mutation CreateTask')) {
    if (!requestBody.variables.name) {
      return Promise.reject(new Error('Task name cannot be empty'));
    } else {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(createTaskResponse),
      }) as Promise<Response>;
    }
  }
});

export default mockFetch;
