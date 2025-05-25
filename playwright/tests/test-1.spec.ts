import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

import { range } from '../src/util';

const SERVER_PORT = 4000;
const SERVER_DIR = 'C:\\projects\\2025\\team-task-track\\server'; // Match your project path

type TaskInfo = {
  name: string;
  id: string;
};

// Create data

const taskInfos: TaskInfo[] = [];
const range5 = range(5, 1);
for (const id of range5) {
  taskInfos.push({ id: `${id}`, name: `Test ${id}` });
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

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
    await sleep(1000);
  } catch (error: any) {
    console.warn(
      'Could not stop server (it might not have been running):',
      error.message
    );
  }
}

async function startServer() {
  // Use `exec` for async execution or `spawn` if you need more control/streaming output
  console.log('Starting Apollo server...');
  execSync(`start_server.bat testDevClean`, {
    cwd: SERVER_DIR,
    stdio: 'inherit',
  });
  console.log('Apollo server started. Waiting for it to become ready...');
  await sleep(5000);
}

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
    console.error('Server did not start or respond correctly:', error);
    throw new Error('Failed to start Apollo server for tests.');
  }
}

test.describe('Page test', () => {
  test.beforeAll(async () => {
    console.log('Attempting to stop server before tests...');
    await stopServer();
    await startServer();
    // const triesCount = range(2);
    for (const _startTry of range(2)) {
      try {
        await checkServer();
      } catch (error) {
        console.log('server not ready, trying again');
        await sleep(5000);
      }
    }
  });

  test('test', async ({ page }) => {
    // page.on('console', (msg) => {
    //   console.log(msg);
    // });
    const startTime = new Date();
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'New Task' }).click();
    for (const taskInfo of taskInfos) {
      await page.getByRole('textbox', { name: 'Task name' }).click();
      await page
        .getByRole('textbox', { name: 'Task name' })
        .fill(taskInfo.name);
      await page.getByRole('button', { name: 'Submit' }).click();
    }
    for (const taskInfo of taskInfos) {
      await expect(page.getByTestId(taskInfo.id)).toContainText(taskInfo.name);
    }
    for (const taskInfo of taskInfos) {
      await page
        .getByTestId(taskInfo.id)
        .getByRole('button', { name: 'Start' })
        .click();
      await page.waitForTimeout(1000);
    }

    for (const taskInfo of taskInfos) {
      const text = await page
        .getByTestId(taskInfo.id)
        .locator('td')
        .nth(1)
        .innerText();
      console.log('Duration text', text);
      expect(text).toBeTruthy();
      // expect(
      //   page.getByTestId(taskInfo.id).locator('td').nth(2).innerText()
      // ).toBeTruthy();
    }
    const taskInfosReversed = [...taskInfos].reverse();
    for (const taskInfo of taskInfosReversed) {
      await page
        .getByTestId(taskInfo.id)
        .getByRole('button', { name: 'Stop' })
        .click();
    }
    for (const taskInfo of taskInfos) {
      await expect(
        page.getByTestId(taskInfo.id).getByRole('button', { name: 'Start' })
      ).toBeVisible();
    }
    const endTime = new Date();

    for (const taskInfo of taskInfos) {
      const taskNameCell = page
        .getByTestId(taskInfo.id)
        .locator('td:first-child');

      const text = await taskNameCell.evaluate(
        (element) => element.textContent
      );
      console.log('taskNameCell', text);
      await taskNameCell.click();
    }

    for (const taskInfo of taskInfos) {
      const durationStart = await page
        .getByTestId(`time-${taskInfo.id}-0`)
        .locator('td:first-child');
      const durationStartText = await durationStart.evaluate(
        (element) => element.textContent
      );
      console.log('durationStartText', durationStartText);
    }
  });
  // test

  test.afterAll(async () => {
    console.log('Stopping Apollo server after tests...');
    await stopServer();
  });
});
