import { test, expect } from '@playwright/test';
import { range } from '../src/util';
import {
  beforeAll,
  checkServer,
  startServer,
  stopServer,
} from '../src/test-util';

test.beforeAll(async () => {
  await beforeAll();
});

test.describe('NewTaskForm', () => {
  const taskInfo = { name: 'Test 1', id: '1' };
  test('show form', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const newTaskButton = page.getByRole('button', { name: /new task/i });
    await expect(newTaskButton).toBeVisible();
    await newTaskButton.click();
    await expect(
      page.getByRole('textbox', { name: /task name/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
  });

  test('Add task', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: /new task/i }).click();
    const newTaskTextBox = page.getByRole('textbox', { name: /task name/i });
    await newTaskTextBox.click();
    await newTaskTextBox.fill(taskInfo.name);
    const submitButton = page.getByRole('button', { name: /submit/i });
    submitButton.click();
    await expect(page.getByTestId(taskInfo.id)).toContainText(taskInfo.name);
  });

  test('Try to add empty Task', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: /new task/i }).click();
    const newTaskTextBox = page.getByRole('textbox', { name: /task name/i });
    await newTaskTextBox.click();
    await newTaskTextBox.fill('');
    const submitButton = page.getByRole('button', { name: /submit/i });
    submitButton.click();
    await expect(page.getByText(/Task name required/i)).toBeVisible();
  });
});

test.afterAll(async () => {
  console.log('Stopping Apollo server after tests...');
  await stopServer();
});
