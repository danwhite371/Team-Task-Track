import { createTaskResponse } from '../__fixtures__/test_data';

const mockFetch = jest.fn();
// mockFetch.mockImplementation(async (_url: string, options?: RequestInit) => {
//   const requestBody = JSON.parse(options?.body as string);
//   console.log('requestBody.variables\n', requestBody.variables);
//   if ((requestBody.query as string).includes('mutation CreateTask')) {
//     if (!requestBody.variables.name) {
//       return Promise.reject(new Error('Task name cannot be empty'));
//     } else {
//       return Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve(createTaskResponse),
//       }) as Promise<Response>;
//     }
//   }
// });

mockFetch.mockImplementation(async (_url: string, options?: RequestInit) => {
  const requestBody = JSON.parse(options?.body as string);
  console.log('requestBody.variables\n', requestBody.variables);

  if ((requestBody.query as string).includes('mutation CreateTask')) {
    if (!requestBody.variables.name) {
      // Simulate an error response from the server
      return Promise.resolve({
        ok: false, // Indicate a failed response
        status: 400, // Example HTTP status code for bad request
        json: () =>
          Promise.resolve({
            errors: [{ message: 'Task name cannot be empty.' }], // Mimic a GraphQL error payload
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
