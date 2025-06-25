function logMockCalls(mocked: jest.Mock<any, any, any>, label: string) {
  console.log(label);
  mocked.mock.calls.forEach((call, index) => {
    console.log(`Call ${index + 1}:`, call);
  });
}

function expectNthCalledWith(mocked: jest.Mock<any, any, any>, nth: number, containing: any) {
  expect(mocked).toHaveBeenNthCalledWith(nth, expect.objectContaining(containing));
}

export { logMockCalls, expectNthCalledWith };
