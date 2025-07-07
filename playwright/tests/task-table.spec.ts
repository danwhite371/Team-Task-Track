import { test, expect } from '@playwright/test';
import { beforeAll, stopServer } from '../src/test-util';
import { range } from '../src/util';

type TaskInfo = {
  name: string;
  id: string;
};
const taskInfos: TaskInfo[] = [];
const range10 = range(10, 1);
for (const id of range10) {
  taskInfos.push({ id: `${id}`, name: `Test ${id}` });
}

test.beforeAll(async () => {
  // start server
  await beforeAll();
});

test.describe('TaskTable', () => {
  // Consider using test.step

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('Add 10 tasks', async ({ page }) => {
    const newTaskButton = page.getByRole('button', { name: /new task/i });
    await newTaskButton.click();
    const newTaskTextBox = page.getByRole('textbox', { name: /task name/i });
    for (const taskInfo of taskInfos) {
      await newTaskTextBox.click();
      await newTaskTextBox.fill(taskInfo.name);
      const submitButton = page.getByRole('button', { name: /submit/i });
      await submitButton.click();
    }
    for (const taskInfo of taskInfos) {
      await expect(page.getByTestId(taskInfo.id)).toContainText(taskInfo.name);
    }
  });

  test('Verify new tasks on page refresh', async ({ page }) => {
    for (const taskInfo of taskInfos) {
      await expect(page.getByTestId(taskInfo.id)).toContainText(taskInfo.name);
    }
  });

  test('Start timers', async ({ page }) => {
    test.setTimeout(30000);
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const startButton = tableRow.getByRole('button', { name: /start/i });
      await startButton.click();
      await page.waitForTimeout(1000);
    }
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      try {
        const durationText = await tableRow.locator('td').nth(1).innerText();
        console.log('Duration text', durationText);
        expect(durationText).toBeTruthy();
      } catch (error) {
        console.log(error);
      }
    }
  });

  test('Stop timers', async ({ page }) => {
    const taskInfosReversed = [...taskInfos].reverse();
    for (const taskInfo of taskInfosReversed) {
      const tableRow = page.getByTestId(taskInfo.id);
      const stopButton = tableRow.getByRole('button', { name: /stop/i });
      await stopButton.click();
    }
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const startButton = tableRow.getByRole('button', { name: /start/i });
      await expect(startButton).toBeVisible();
    }
  });

  test('Show time table', async ({ page }) => {
    test.setTimeout(30000);
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const taskNameCell = tableRow.locator('td:first-child');
      await taskNameCell.click();
    }
    for (const taskInfo of taskInfos) {
      const timeRow = page.getByTestId(`time-${taskInfo.id}-0`);
      const durationStart = timeRow.locator('td:first-child');
      const durationStartText = await durationStart.evaluate((element) => element.textContent);

      console.log('taskInfo.name', taskInfo.name);
      console.log('durationStartText', durationStartText);
      expect(durationStart).toHaveText(/.+/);
    }
  });
});

test.afterAll(async () => {
  console.log('Stopping Apollo server after tests...');
  await stopServer();
});
