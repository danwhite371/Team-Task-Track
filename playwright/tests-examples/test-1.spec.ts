import { test, expect } from '@playwright/test';
import { range } from '../src/util';
import {
  beforeAll,
  checkServer,
  startServer,
  stopServer,
} from '../src/test-util';

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

test.describe('Page test', () => {
  test.beforeAll(async () => {
    // start client if is isn't already started
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
