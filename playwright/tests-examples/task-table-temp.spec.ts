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
  await beforeAll();
});

test.describe('TaskTable', () => {
  test('Test TaskTable', async ({ page }) => {
    // Add 10 tasks
    await page.goto('http://localhost:5173/');
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

    // Verify new tasks on page refresh
    for (const taskInfo of taskInfos) {
      await expect(page.getByTestId(taskInfo.id)).toContainText(taskInfo.name);
    }

    // Start timers
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const startButton = tableRow.getByRole('button', { name: /start/i });
      await startButton.click();
      await page.waitForTimeout(1000);
    }
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const durationText = tableRow.locator('td').nth(1).innerText();
      console.log('Duration text', durationText);
      expect(durationText).toBeTruthy();
    }

    // Stop timers
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

    // Show time table
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const taskNameCell = tableRow.locator('td:first-child');
      await taskNameCell.click();
    }
    for (const taskInfo of taskInfos) {
      const timeRow = page.getByTestId(`time-${taskInfo.id}-0`);
      const durationStart = timeRow.locator('td:first-child');
      const durationStartText = await durationStart.evaluate(
        (element) => element.textContent
      );
      console.log('durationStartText', durationStartText);
      expect(durationStart).toHaveText(/.+/);
    }
  });
});
/*
test.describe('TaskTable', () => {
  test.describe.configure({ mode: 'serial' });
  test('Add 10 tasks', async ({ page }) => {
    await page.goto('http://localhost:5173/');
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
    await page.goto('http://localhost:5173/');
    for (const taskInfo of taskInfos) {
      await expect(page.getByTestId(taskInfo.id)).toContainText(taskInfo.name);
    }
  });

  test('Start timers', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const startButton = tableRow.getByRole('button', { name: /start/i });
      await startButton.click();
      await page.waitForTimeout(1000);
    }
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const durationText = tableRow.locator('td').nth(1).innerText();
      console.log('Duration text', durationText);
      expect(durationText).toBeTruthy();
    }
  });

  test('Stop timers', async ({ page }) => {
    await page.goto('http://localhost:5173/');
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

  test('Show time table ', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    for (const taskInfo of taskInfos) {
      const tableRow = page.getByTestId(taskInfo.id);
      const taskNameCell = tableRow.locator('td:first-child');
      await taskNameCell.click();
    }
    for (const taskInfo of taskInfos) {
      const timeRow = page.getByTestId(`time-${taskInfo.id}-0`);
      const durationStart = timeRow.locator('td:first-child');
      const durationStartText = await durationStart.evaluate(
        (element) => element.textContent
      );
      console.log('durationStartText', durationStartText);
      expect(durationStart).toHaveText(/.+/);
    }
  });
});
*/

test.afterAll(async () => {
  console.log('Stopping Apollo server after tests...');
  await stopServer();
});
