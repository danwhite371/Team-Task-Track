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

export { mockPino };
