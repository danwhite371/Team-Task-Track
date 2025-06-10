import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { range } from './util';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
const SERVER_PORT = 4000;
const SERVER_DIR = 'C:\\projects\\2025\\team-task-track\\server'; // Match your project path
// const SERVER_DIR = '/c/projects/2025/team-task-track/server';

async function stopServer() {
  try {
    const response = await fetch(`http://localhost:${SERVER_PORT}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'mutation Mutation { stopServer }' }),
    });
    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data).toHaveProperty('data.stopServer');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error: any) {
    console.warn(
      'Could not stop server (it might not have been running):',
      error.message
    );
  }
}

async function startServer() {
  const scriptPath = path.posix.join(
    '/',
    'c',
    '/',
    'projects',
    '2025',
    'team-task-track',
    'server',
    'start_server.sh'
  );
  console.log('start_server path', scriptPath);
  console.log('Starting Apollo server...');

  const scriptOutput = await runBashScript(scriptPath);
  console.log(`Script output:\n${scriptOutput}`);

  console.log('Apollo server started. Waiting for it to become ready...');
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

/*
async function startServer() {
  // Use `exec` for async execution or `spawn` if you need more control/streaming output
  console.log('Starting Apollo server...');
  execSync(`start_server.bat testDevClean`, {
    cwd: SERVER_DIR,
    stdio: 'inherit',
  });
  console.log('Apollo server started. Waiting for it to become ready...');
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
*/

async function checkServer() {
  try {
    const response = await fetch(`http://localhost:${SERVER_PORT}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }), // A simple introspection query
    });
    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data).toHaveProperty('data.__typename');
    console.log('Server is ready and responded to a test query.');
  } catch (error) {
    console.error('Server did not start or respond correctly:');
    throw new Error('Failed to start Apollo server for tests.');
  }
}

async function runBashScript(scriptPath: string) {
  const command = `sh -c "${scriptPath} testDevClean"`;
  console.log(`Command path\n${command}`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error(`Bash script error:\n${stderr}`);
      throw new Error(`Bash script failed: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    console.error(`Error running Bash script:`, error);
    throw error;
  }
}

// function executeScript(command: string) {
//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       resolve({ stdout, stderr });
//     });
//   });
// };

async function beforeAll() {
  console.log('Attempting to stop server before tests...');
  await stopServer();
  await startServer();

  for (const _startTry of range(5)) {
    try {
      await checkServer();
      break;
    } catch (error) {
      console.log('server not ready, trying again');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

export { stopServer, startServer, checkServer, beforeAll };
